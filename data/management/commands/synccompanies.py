import json
import logging

from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError

from data.models import Company, Hotel

logger = logging.getLogger('data')


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        # voivodeships = ['hotels', 'podlaskie']
        voivodeships = ['hotels',
                        'dolnośląskie',
                        'lubelskie',
                        'lubuskie',
                        'mazowieckie',
                        'małopolskie',
                        'opolskie',
                        'podkarpackie',
                        'podlaskie',
                        'pomorskie',
                        'warmińsko_mazurskie',
                        'wielkopolskie',
                        'zachodniopomorskie',
                        'łódzkie',
                        'śląskie',
                        'świętokrzyskie']
        # voivodeships = ['świętokrzyskie']
        pages = {
            'hotels': 9,
            'dolnośląskie': 247,
            'lubelskie': 213,
            'lubuskie': 121,
            'mazowieckie': 1000,
            'małopolskie': 545,
            'opolskie': 106,
            'podkarpackie': 227,
            'podlaskie': 113,
            'pomorskie': 350,
            'warmińsko_mazurskie': 133,
            'wielkopolskie': 606,
            'zachodniopomorskie': 204,
            'łódzkie': 244,
            'śląskie': 610,
            'świętokrzyskie': 109
        }
        logger.info('Started sync companies from json files')
        for voivodeship in voivodeships:
            logger.info(
                'Syncing companies for {} in progress...'.format(voivodeship))
            model = Hotel if voivodeship == 'hotels' else Company
            for page in range(2, pages[voivodeship] + 1):
                with open('rejestriodata/{}/{}_page{}.json'.format(voivodeship, voivodeship, page), 'r') as f:
                    companies = json.loads(f.read())

                    for company in companies:
                        if "name" not in company:
                            continue
                        if "address" not in company:
                            continue
                        if "lat" not in company:
                            continue
                        if "lng" not in company:
                            continue
                        if 'nip' not in company:
                            logger.info(
                                'Company {} does not have a nip value. Ignoring it.'.format(company['name']))
                            continue
                        name = company['name'].capitalize()
                        name_short = company['name_short'].capitalize()
                        nip = str(company['nip'])
                        street = company['address']['street']
                        house_no = str(company['address']['house_no'])
                        postcode = str(company['address']['code'])
                        city = company['address']['city']
                        lat = company['lat']
                        lng = company['lng']

                        if len(name) > 300 or len(name) == 0:
                            continue

                        if len(name_short) > 250 or len(name_short) == 0:
                            continue

                        if len(nip) > 11 or len(nip) == 0:
                            continue

                        if len(street) > 60 :
                            continue

                        if len(house_no) > 10:
                            continue

                        if len(postcode) > 8:
                            continue

                        if not lat or not lng:
                            continue

                        try:
                            c = model(name=name, name_short=name_short, nip=nip, street=street, house_no=house_no,
                                      postcode=postcode, city=city, voivodeship=voivodeship, latitude=lat,
                                      longitude=lng)
                            c.save()
                        except IntegrityError:
                            logger.info(
                                '{} is already in database, skipping'.format(name))
                logger.info('Syncing {}_page{}.json is completed'.format(
                    voivodeship, page))
            logger.info('Syncing for {} is completed'.format(voivodeship))
