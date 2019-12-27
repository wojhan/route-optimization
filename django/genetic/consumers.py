from channels.generic.websocket import AsyncWebsocketConsumer
from .utils import RouteOptimizer
import json


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

        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'progress_message',
        #         'message': self.progress
        #     }
        # )
        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'connect',
        #         'message': 'no elo'
        #     }
        # )

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
