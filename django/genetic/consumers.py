import json

from celery.result import AsyncResult
from channels.generic.websocket import AsyncWebsocketConsumer

from data import models


class RouteConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.room_name = None
        self.room_group_name = None

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['business_trip_id']
        self.room_group_name = 'business_trip_%s' % self.room_name
        # self.progress = RouteOptimizer.routes_in_progress[self.room_name]

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        business_trip = models.BusinessTrip.objects.get(pk=int(self.room_name))
        task = business_trip.task_id
        if task:
            result = AsyncResult(task)
            if result.ready():
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'task_result',
                        'error': result.state != 'SUCCESS',
                        'result': str(result.result)
                    }
                )
                business_trip.is_processed = True
                business_trip.save()


    async def disconnect(self, code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def progress_message(self, event):
        message = event['message']
        self.progress = message

        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def task_result(self, event):
        error = event['error']
        result = event['result']

        print(result)

        await self.send(text_data=json.dumps({
            'error': error,
            'message': result
        }))
