import time
import channels.layers
from asgiref.sync import async_to_sync
from django.core.management.base import BaseCommand
from genetic import consumers

class Command(BaseCommand):
    help = ''

    def add_arguments(self, parser):
        parser.add_argument('business_trip_id', nargs='+', type=int)

    def handle(self, *args, **options):
        business_trip_id = options['business_trip_id'][0]
        group_name = 'business_trip_%s' % business_trip_id
        channel_layer = channels.layers.get_channel_layer()
        for i in range(101):
            async_to_sync(channel_layer.group_send)(
                group_name,
                {
                    'type': 'business_trip_message',
                    'messageType': consumers.RouteState.PROCESSING.value,
                    'message': {
                        "value": i/100,
                        "timeLeft": 50 - i
                    }
                }
            )
            time.sleep(0.5)