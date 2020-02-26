import requests
import math
import json
import os
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# voivodeships = {
#     'dolnosląskie': '02',
#     'kujawsko_pomorskie': '04',
#     'lubelskie': '06',
#     'lubuskie': '08',
#     'łódzkie': '10',
#     'małopolskie': '12',
#     'mazowieckie': '14',
#     'opolskie': '16',
#     'podkarpackie': '18',
#     'podlaskie': '20',
#     'pomorskie': '22',
#     'śląskie': '24',
#     'świętokrzyskie': '26',
#     'warmińsko_mazurskie': '28',
#     'wielkopolskie': '30',
#     'zachodniopomorskie': '32'
# }

voivodeships = {
    # 'mazowieckie': '14',
    # 'lubuskie': '08',
    'łódzkie': '10',
}

session = requests.Session()
retry = Retry(connect=3, backoff_factor=0.5)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)


def update_company(companies):
    for company in companies:
        street = company['address']['street'] if company['address']['street'] else company['address']['city']
        house_no = company['address']['house_no']
        postcode = company['address']['code']
        city = company['address']['city']
        r = session.get('https://maps.googleapis.com/maps/api/geocode/json?address={}&key={}'.format(
            '{} {}, {} {}'.format(street, house_no, postcode, city), os.environ.get('GOOGLE_MAPS_API_KEY')))
        company['lng'] = None
        company['lat'] = None
        if r.json()['results']:
            company['lat'] = round(r.json()['results'][0]
                                   ['geometry']['location']['lat'], 7)
            company['lng'] = round(r.json()['results'][0]
                                   ['geometry']['location']['lng'], 7)

    return companies


for voivodeship, terc in voivodeships.items():
    r = requests.get('https://rejestr.io/api/v1/krs?wojewodztwo={}&per_page=100'.format(terc),
                     headers={"Authorization": os.environ.get('REJESTRIO_API_KEY')})
    request_json = r.json()
    companies = request_json['items']
    total = request_json['total']
    pages = math.ceil(total / 100)

    companies = update_company(companies)

    with open('rejestriodata/{}/{}_page{}.json'.format(voivodeship, voivodeship, 1), 'w+', encoding='utf-8') as company_data_file:
        json.dump(companies, company_data_file, indent=4, ensure_ascii=False)

    for page in range(13, pages + 1):
        r = requests.get('https://rejestr.io/api/v1/krs?wojewodztwo={}&page={}&per_page=100'.format(terc, page),
                         headers={"Authorization": os.environ.get('REJESTRIO_API_KEY')})
        companies = r.json()['items']

        companies = update_company(companies)

        with open('rejestriodata/{}/{}_page{}.json'.format(voivodeship, voivodeship, page), 'w+', encoding='utf-8') as company_data_file:
            json.dump(companies, company_data_file,
                      indent=4, ensure_ascii=False)

# r = requests.get('https://rejestr.io/api/v1/krs?name=hotel&per_page=100',
#                  headers={"Authorization": os.environ.get('REJESTRIO_API_KEY')})
# request_json = r.json()
# hotels = request_json['items']
# total = request_json['total']
# pages = math.ceil(total / 100)

# hotels = update_company(hotels)

# with open('rejestriodata/hotels/hotels_page{}.json'.format(1), 'w+', encoding='utf-8') as hotel_data_file:
#     json.dump(hotels, hotel_data_file, indent=4, ensure_ascii=False)

# for page in range(2, pages+1):
#     r = requests.get('https://rejestr.io/api/v1/krs?name=hotel&page={}&per_page=100'.format(page),
#                      headers={"Authorization": os.environ.get('REJESTRIO_API_KEY')})
#     request_json = r.json()
#     hotels = request_json['items']

#     hotels = update_company(hotels)

#     with open('rejestriodata/hotels/hotels_page{}.json'.format(page), 'w+', encoding='utf-8') as hotel_data_file:
#         json.dump(hotels, hotel_data_file, indent=4, ensure_ascii=False)
