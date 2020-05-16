import time

from django.core.management.base import BaseCommand

from data import utils

class Command(BaseCommand):
    help = ''

    def add_arguments(self, parser):
        parser.add_argument('business_trip_id', nargs='+', type=int)

    def handle(self, *args, **options):
        business_trip_id = options['business_trip_id'][0]
        for i in range(101):
            utils.update_business_trip_by_ws(business_trip_id, 'PROCESSING', dict(value=i/100, timeLeft=50-i))
            time.sleep(0.5)