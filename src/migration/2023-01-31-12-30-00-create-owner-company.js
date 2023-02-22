const Country = require('../models/setting/country');
const Governorate = require('../models/setting/governorate');
const Municipality = require('../models/setting/municipality');

const script = async () => {
  try {
    const countries = [
      {
        governorate: 'Tunis',
        municipalities: [
          {
            Municipality: 'Tunis',
          },
          {
            Municipality: 'Le Bardo',
          },
          {
            Municipality: 'Le Kram',
          },
          {
            Municipality: 'La Goulette',
          },
          {
            Municipality: 'Carthage',
          },
          {
            Municipality: 'Sidi Bou Said',
          },
          {
            Municipality: 'La Marsa',
          },
          {
            Municipality: 'Sidi Hassine',
          },
        ],
      },
      {
        governorate: 'Ariana',
        municipalities: [
          {
            Municipality: 'Ariana',
          },
          {
            Municipality: 'La Soukra',
          },
          {
            Municipality: 'Raoued',
          },
          {
            Municipality: 'Kalâat el-Andalous',
          },
          {
            Municipality: 'Sidi Thabet',
          },
          {
            Municipality: 'Ettadhamen-Mnihla',
          },
        ],
      },
      {
        governorate: 'Ben Arous',
        municipalities: [
          {
            Municipality: 'Ben Arous',
          },
          {
            Municipality: 'El Mourouj',
          },
          {
            Municipality: 'Hammam Lif',
          },
          {
            Municipality: 'Hammam Chott',
          },
          {
            Municipality: 'Bou Mhel el-Bassatine',
          },
          {
            Municipality: 'Ezzahra',
          },
          {
            Municipality: 'Radès',
          },
          {
            Municipality: 'Mégrine',
          },
          {
            Municipality: 'Mohamedia-Fouchana',
          },
          {
            Municipality: 'Mornag',
          },
          {
            Municipality: 'Khalidia',
          },
        ],
      },
      {
        governorate: 'Manouba',
        municipalities: [
          {
            Municipality: 'Manouba',
          },
          {
            Municipality: 'Den Den',
          },
          {
            Municipality: 'Douar Hicher',
          },
          {
            Municipality: 'Oued Ellil',
          },
          {
            Municipality: 'Mornaguia',
          },
          {
            Municipality: 'Borj El Amri',
          },
          {
            Municipality: 'Djedeida',
          },
          {
            Municipality: 'Tebourba',
          },
          {
            Municipality: 'El Battan',
          },
        ],
      },
      {
        governorate: 'Nabeul',
        municipalities: [
          {
            Municipality: 'Nabeul',
          },
          {
            Municipality: 'Dar Chaabane',
          },
          {
            Municipality: 'Béni Khiar',
          },
          {
            Municipality: 'El Maâmoura',
          },
          {
            Municipality: 'Somâa',
          },
          {
            Municipality: 'Korba',
          },
          {
            Municipality: 'Tazerka',
          },
          {
            Municipality: 'Menzel Temime',
          },
          {
            Municipality: 'Menzel Horr',
          },
          {
            Municipality: 'El Mida',
          },
          {
            Municipality: 'Kelibia',
          },
          {
            Municipality: 'Azmour',
          },
          {
            Municipality: 'Hammam Ghezèze',
          },
          {
            Municipality: 'Dar Allouch',
          },
          {
            Municipality: 'El Haouaria',
          },
          {
            Municipality: 'Takelsa',
          },
          {
            Municipality: 'Soliman',
          },
          {
            Municipality: 'Korbous',
          },
          {
            Municipality: 'Menzel Bouzelfa',
          },
          {
            Municipality: 'Béni Khalled',
          },
          {
            Municipality: 'Zaouiet Djedidi',
          },
          {
            Municipality: 'Grombalia',
          },
          {
            Municipality: 'Bou Argoub',
          },
          {
            Municipality: 'Hammamet',
          },
        ],
      },
      {
        governorate: 'Zaghouan',
        municipalities: [
          {
            Municipality: 'Zaghouan',
          },
          {
            Municipality: 'Zriba',
          },
          {
            Municipality: 'Bir Mcherga',
          },
          {
            Municipality: 'Djebel Oust',
          },
          {
            Municipality: 'El Fahs',
          },
          {
            Municipality: 'Nadhour',
          },
        ],
      },
      {
        governorate: 'Bizerte',
        municipalities: [
          {
            Municipality: 'Bizerte',
          },
          {
            Municipality: 'Sejnane',
          },
          {
            Municipality: 'Mateur',
          },
          {
            Municipality: 'Menzel Bourguiba',
          },
          {
            Municipality: 'Tinja',
          },
          {
            Municipality: 'Ghar al Milh',
          },
          {
            Municipality: 'Aousja',
          },
          {
            Municipality: 'Menzel Jemil',
          },
          {
            Municipality: 'Menzel Abderrahmane',
          },
          {
            Municipality: 'El Alia',
          },
          {
            Municipality: 'Ras Jebel',
          },
          {
            Municipality: 'Metline',
          },
          {
            Municipality: 'Raf Raf',
          },
        ],
      },
      {
        governorate: 'Béja',
        municipalities: [
          {
            Municipality: 'Béja',
          },
          {
            Municipality: 'El Maâgoula',
          },
          {
            Municipality: 'Zahret Medien',
          },
          {
            Municipality: 'Nefza',
          },
          {
            Municipality: 'Téboursouk',
          },
          {
            Municipality: 'Testour',
          },
          {
            Municipality: 'Goubellat',
          },
          {
            Municipality: 'Majaz al Bab',
          },
        ],
      },
      {
        governorate: 'Jendouba',
        municipalities: [
          {
            Municipality: 'Jendouba',
          },
          {
            Municipality: 'Bou Salem',
          },
          {
            Municipality: 'Tabarka',
          },
          {
            Municipality: 'Aïn Draham',
          },
          {
            Municipality: 'Fernana',
          },
          {
            Municipality: "Beni M'Tir",
          },
          {
            Municipality: 'Ghardimaou',
          },
          {
            Municipality: 'Oued Melliz',
          },
        ],
      },
      {
        governorate: 'Kef',
        municipalities: [
          {
            Municipality: 'El Kef',
          },
          {
            Municipality: 'Nebeur',
          },
          {
            Municipality: 'Touiref',
          },
          {
            Municipality: 'Sakiet Sidi Youssef',
          },
          {
            Municipality: 'Tajerouine',
          },
          {
            Municipality: 'Menzel Salem',
          },
          {
            Municipality: 'Kalaat es Senam',
          },
          {
            Municipality: 'Kalâat Khasba',
          },
          {
            Municipality: 'Jérissa',
          },
          {
            Municipality: 'El Ksour',
          },
          {
            Municipality: 'Dahmani',
          },
          {
            Municipality: 'Sers',
          },
        ],
      },
      {
        governorate: 'Siliana',
        municipalities: [
          {
            Municipality: 'Siliana',
          },
          {
            Municipality: 'Bou Arada',
          },
          {
            Municipality: 'Gaâfour',
          },
          {
            Municipality: 'El Krib',
          },
          {
            Municipality: 'Sidi Bou Rouis',
          },
          {
            Municipality: 'Maktar',
          },
          {
            Municipality: 'Rouhia',
          },
          {
            Municipality: 'Kesra',
          },
          {
            Municipality: 'Bargou',
          },
          {
            Municipality: 'El Aroussa',
          },
        ],
      },
      {
        governorate: 'Sousse',
        municipalities: [
          {
            Municipality: 'Sousse',
          },
          {
            Municipality: 'Ksibet Thrayet',
          },
          {
            Municipality: 'Ezzouhour',
          },
          {
            Municipality: 'Zaouiet Sousse',
          },
          {
            Municipality: 'Hammam Sousse',
          },
          {
            Municipality: 'Akouda',
          },
          {
            Municipality: 'Kalâa Kebira',
          },
          {
            Municipality: 'Sidi Bou Ali',
          },
          {
            Municipality: 'Hergla',
          },
          {
            Municipality: 'Enfidha',
          },
          {
            Municipality: 'Bouficha',
          },
          {
            Municipality: 'Sidi El Hani',
          },
          {
            Municipality: "M'saken",
          },
          {
            Municipality: 'Kalâa Seghira',
          },
          {
            Municipality: 'Messaadine',
          },
          {
            Municipality: 'Kondar',
          },
        ],
      },
      {
        governorate: 'Monastir',
        municipalities: [
          {
            Municipality: 'Monastir',
          },
          {
            Municipality: 'Khniss',
          },
          {
            Municipality: 'Ouerdanin',
          },
          {
            Municipality: 'Sahline Moôtmar',
          },
          {
            Municipality: 'Sidi Ameur',
          },
          {
            Municipality: 'Zéramdine',
          },
          {
            Municipality: 'Beni Hassen',
          },
          {
            Municipality: 'Ghenada',
          },
          {
            Municipality: 'Jemmal',
          },
          {
            Municipality: 'Menzel Kamel',
          },
          {
            Municipality: 'Zaouiet Kontoch',
          },
          {
            Municipality: 'Bembla-Mnara',
          },
          {
            Municipality: 'Menzel Ennour',
          },
          {
            Municipality: 'El Masdour',
          },
          {
            Municipality: 'Moknine',
          },
          {
            Municipality: 'Sidi Bennour',
          },
          {
            Municipality: 'Menzel Farsi',
          },
          {
            Municipality: 'Amiret El Fhoul',
          },
          {
            Municipality: 'Amiret Touazra',
          },
          {
            Municipality: 'Amiret El Hojjaj',
          },
          {
            Municipality: 'Cherahil',
          },
          {
            Municipality: 'Bekalta',
          },
          {
            Municipality: 'Téboulba',
          },
          {
            Municipality: 'Ksar Hellal',
          },
          {
            Municipality: 'Ksibet El Mediouni',
          },
          {
            Municipality: 'Benen Bodher',
          },
          {
            Municipality: 'Touza',
          },
          {
            Municipality: 'Sayada',
          },
          {
            Municipality: 'Lemta',
          },
          {
            Municipality: 'Bouhjar',
          },
          {
            Municipality: 'Menzel Hayet',
          },
        ],
      },
      {
        governorate: 'Mahdia',
        municipalities: [
          {
            Municipality: 'Mahdia',
          },
          {
            Municipality: 'Rejiche',
          },
          {
            Municipality: 'Bou Merdes',
          },
          {
            Municipality: 'Ouled Chamekh',
          },
          {
            Municipality: 'Chorbane',
          },
          {
            Municipality: 'Hebira',
          },
          {
            Municipality: 'Essouassi',
          },
          {
            Municipality: 'El Djem',
          },
          {
            Municipality: 'Kerker',
          },
          {
            Municipality: 'Chebba',
          },
          {
            Municipality: 'Melloulèche',
          },
          {
            Municipality: 'Sidi Alouane',
          },
          {
            Municipality: 'Ksour Essef',
          },
          {
            Municipality: 'El Bradâa',
          },
        ],
      },
      {
        governorate: 'Sfax',
        municipalities: [
          {
            Municipality: 'Sfax',
          },
          {
            Municipality: 'Sakiet Ezzit',
          },
          {
            Municipality: 'Chihia',
          },
          {
            Municipality: 'Sakiet Eddaïer',
          },
          {
            Municipality: 'Gremda',
          },
          {
            Municipality: 'El Ain',
          },
          {
            Municipality: 'Thyna',
          },
          {
            Municipality: 'Agareb',
          },
          {
            Municipality: 'Jebiniana',
          },
          {
            Municipality: 'El Hencha',
          },
          {
            Municipality: 'Menzel Chaker',
          },
          {
            Municipality: 'Ghraïba, Tunisia',
          },
          {
            Municipality: 'Bir Ali Ben Khélifa',
          },
          {
            Municipality: 'Skhira',
          },
          {
            Municipality: 'Mahares',
          },
          {
            Municipality: 'Kerkennah',
          },
        ],
      },
      {
        governorate: 'Kairouan',
        municipalities: [
          {
            Municipality: 'Kairouan',
          },
          {
            Municipality: 'Chebika',
          },
          {
            Municipality: 'Sbikha',
          },
          {
            Municipality: 'Oueslatia',
          },
          {
            Municipality: 'Aïn Djeloula',
          },
          {
            Municipality: 'Haffouz',
          },
          {
            Municipality: 'Alaâ',
          },
          {
            Municipality: 'Hajeb El Ayoun',
          },
          {
            Municipality: 'Nasrallah',
          },
          {
            Municipality: 'Menzel Mehiri',
          },
          {
            Municipality: 'Echrarda',
          },
          {
            Municipality: 'Bou Hajla',
          },
        ],
      },
      {
        governorate: 'Kasserine',
        municipalities: [
          {
            Municipality: 'Kasserine',
          },
          {
            Municipality: 'Sbeitla',
          },
          {
            Municipality: 'Sbiba',
          },
          {
            Municipality: 'Jedelienne',
          },
          {
            Municipality: 'Thala',
          },
          {
            Municipality: 'Haïdra',
          },
          {
            Municipality: 'Foussana',
          },
          {
            Municipality: 'Fériana',
          },
          {
            Municipality: 'Thélepte',
          },
          {
            Municipality: 'Magel Bel Abbès',
          },
        ],
      },
      {
        governorate: 'Sidi Bouzid',
        municipalities: [
          {
            Municipality: 'Sidi Bouzid',
          },
          {
            Municipality: 'Jilma',
          },
          {
            Municipality: 'Cebalet',
          },
          {
            Municipality: 'Bir El Hafey',
          },
          {
            Municipality: 'Sidi Ali Ben Aoun',
          },
          {
            Municipality: 'Menzel Bouzaiane',
          },
          {
            Municipality: 'Meknassy',
          },
          {
            Municipality: 'Mezzouna',
          },
          {
            Municipality: 'Regueb',
          },
          {
            Municipality: 'Ouled Haffouz',
          },
        ],
      },
      {
        governorate: 'Gabès',
        municipalities: [
          {
            Municipality: 'Gabès',
          },
          {
            Municipality: 'Chenini Nahal',
          },
          {
            Municipality: 'Ghannouch',
          },
          {
            Municipality: 'Métouia',
          },
          {
            Municipality: 'Oudhref',
          },
          {
            Municipality: 'El Hamma',
          },
          {
            Municipality: 'Matmata',
          },
          {
            Municipality: 'Nouvelle Matmata',
          },
          {
            Municipality: 'Mareth',
          },
          {
            Municipality: 'Zarat',
          },
        ],
      },
      {
        governorate: 'Mednine',
        municipalities: [
          {
            Municipality: 'Medenine',
          },
          {
            Municipality: 'Beni Khedache',
          },
          {
            Municipality: 'Ben Gardane',
          },
          {
            Municipality: 'Zarzis',
          },
          {
            Municipality: 'Houmt El Souk (Djerba)',
          },
          {
            Municipality: 'Midoun (Djerba)',
          },
          {
            Municipality: 'Ajim (Djerba)',
          },
        ],
      },
      {
        governorate: 'Tataouine',
        municipalities: [
          {
            Municipality: 'Tataouine',
          },
          {
            Municipality: 'Bir Lahmar',
          },
          {
            Municipality: 'Ghomrassen',
          },
          {
            Municipality: 'Dehiba',
          },
          {
            Municipality: 'Remada',
          },
        ],
      },
      {
        governorate: 'Gafsa',
        municipalities: [
          {
            Municipality: 'Gafsa',
          },
          {
            Municipality: 'El Ksar',
          },
          {
            Municipality: 'Moularès',
          },
          {
            Municipality: 'Redeyef',
          },
          {
            Municipality: 'Métlaoui',
          },
          {
            Municipality: 'Mdhila',
          },
          {
            Municipality: 'El Guettar',
          },
          {
            Municipality: 'Sened',
          },
        ],
      },
      {
        governorate: 'Tozeur',
        municipalities: [
          {
            Municipality: 'Tozeur',
          },
          {
            Municipality: 'Degache',
          },
          {
            Municipality: 'Hamet Jerid',
          },
          {
            Municipality: 'Nafta',
          },
          {
            Municipality: 'Tamerza',
          },
        ],
      },
      {
        governorate: 'Kebili',
        municipalities: [
          {
            Municipality: 'Kebili',
          },
          {
            Municipality: 'Djemna',
          },
          {
            Municipality: 'Douz',
          },
          {
            Municipality: 'El Golâa',
          },
          {
            Municipality: 'Souk Lahad',
          },
        ],
      },
    ];
    const country = new Country({
      code: '1',
      countryName: 'Tunisia',
    });
    await country.save();
    for await (const [index, governorate] of countries.entries()) {
      const newGovernorate = new Governorate({
        countryId: country._id,
        code: index.toString(),
        governorateName: governorate.governorate,
      });
      await newGovernorate.save();
      for await (const [indexA, municipality] of governorate.municipalities.entries()) {
        const newMunicipality = new Municipality({
          countryId: country._id,
          governorateId: newGovernorate._id,
          code: indexA.toString(),
          municipalityName: municipality.Municipality,
        });
        await newMunicipality.save();
      }
    }
  } catch (e) {
    console.info(`Error! could not be added - ${e.message}`);
  }
};
module.exports = script;
