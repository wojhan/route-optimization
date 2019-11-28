import json
import logging
from django.core.management.base import BaseCommand
from data.models import Company

logger = logging.getLogger('data')


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        voivodeships = ['podlaskie']
        pages = {
            'podlaskie': 113
        }
        logger.info('Started sync companies from json files')
        for voivodeship in voivodeships:
            logger.info(
                'Syncing companies for {} in progress...'.format(voivodeship))
            for page in range(1, pages[voivodeship] + 1):
                with open('rejestriodata/{}/{}_page{}.json'.format(voivodeship, voivodeship, page), 'r') as f:
                    companies = json.loads(f.read())

                    for company in companies:
                        if 'nip' not in company:
                            logger.info(
                                'Company {} does not have a nip value. Ignoring it.'.format(company['name']))
                            continue
                        name = company['name'].capitalize()
                        name_short = company['name_short'].capitalize()
                        nip = company['nip']
                        street = company['address']['street']
                        house_no = company['address']['house_no']
                        postcode = company['address']['code']
                        city = company['address']['city']
                        lat = company['lat']
                        lng = company['lng']

                        c = Company(name=name, name_short=name_short, nip=nip, street=street, house_no=house_no,
                                    postcode=postcode, city=city, voivodeship=voivodeship, latitude=lat, longitude=lng)
                        c.save()
                logger.info('Syncing {}_page{}.json is completed'.format(
                    voivodeship, page))
            logger.info('Syncing for {} is completed'.format(voivodeship))
