import json
import logging
import random

from django.core.management.base import BaseCommand

from data.models import BusinessTrip, Company, Requisition

logger = logging.getLogger('data')


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('requisitions_count', nargs='+', type=int)

    def handle(self, *args, **options):
        print(Company.objects.count())
        for i in range(options['requisitions_count'][0]):
            random_company_id = random.randint(1, Company.objects.count())
            # random_business_trip_id = random.randint(
            #     1, BusinessTrip.objects.count())
            random_estimated_profit = random.randint(1000, 10000)
            print(random_company_id)
            try:
                company = Company.objects.get(pk=random_company_id)
            except:
                continue
            # print(Company.objects.all()[0].pk)
            # business_trip = BusinessTrip.objects.get(
            #     pk=random_business_trip_id)

            Requisition.objects.create(
                estimated_profit=random_estimated_profit, company=company, business_trip=None)
        logger.info('Generating {} requisitions completed'.format(
            options['requisitions_count'][0]))
