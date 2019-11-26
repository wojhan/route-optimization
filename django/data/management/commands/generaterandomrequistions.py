from data.models import Requistion, Company, BusinessTrip

import json
import logging
import random
from django.core.management.base import BaseCommand

logger = logging.getLogger('data')


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('requistions_count', nargs='+', type=int)

    def handle(self, *args, **options):
        for i in range(options['requistions_count'][0]):
            random_company_id = random.randint(1, Company.objects.count())
            random_business_trip_id = random.randint(
                1, BusinessTrip.objects.count())
            random_estimated_profit = random.randint(10, 200)

            company = Company.objects.get(pk=random_company_id)
            business_trip = BusinessTrip.objects.get(
                pk=random_business_trip_id)

            Requistion.objects.create(
                estimated_profit=random_estimated_profit, company=company, business_trip=business_trip)
        logger.info('Generating {} requistions completed'.format(
            options['requistions_count'][0]))
