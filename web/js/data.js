/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var cities = [
    {
        city: 'Auckland',
        lat: -36.848189,
        lng: 174.755606
    },
    {
        city: 'Wellington',
        lat: -41.286821, 
        lng: 174.773871
    },
    {
        city: 'Christchurch',
        lat: -43.529816, 
        lng: 172.625856
    },
    {
        city: 'Hamilton',
        lat: -37.786945, 
        lng: 175.279000
    },
    {
        city: 'Napier-Hastings',
        lat: -39.492772, 
        lng: 176.907433
    },
    {
        city: 'Tauranga',
        lat: -37.688075, 
        lng: 176.163781
    },
    {
        city: 'Dunedin',
        lat: -45.879028, 
        lng: 170.502400
    },
    {
        city: 'Palmerston North',
        lat: -40.351810, 
        lng: 175.608400
    },
    {
        city: 'Nelson',
        lat: -41.270906, 
        lng: 173.281544
    },
    {
        city: 'Rotorua',
        lat: -38.137085, 
        lng: 176.248188
    },
    {
        city: 'New Plymouth',
        lat: -39.055780, 
        lng: 174.074668
    },
    {
        city: 'Whangarei',
        lat: -35.725125, 
        lng: 174.322286
    },
    {
        city: 'Invercargill',
        lat: -46.413266, 
        lng: 168.351970
    },
    {
        city: 'Whanganui',
        lat: -39.930079, 
        lng: 175.047820
    },
    {
        city: 'Gisborne',
        lat: -38.662540, 
        lng: 178.017232
    },
    {
        city: 'Blenheim',
        lat: -41.513470, 
        lng: 173.959416
    },
    {
        city: 'Timaru',
        lat: -44.396984, 
        lng: 171.254019
    },
    {
        city: 'Greymouth',
        lat: -42.450554, 
        lng: 171.208462
    }
];

var beaches = {
    ninetyMileBeach: {
        name: '90 Mile Beach',
        spotId: 118,
        lat: -34.719280,
        lng: 172.928415
    },
    ahuAhu: {
        name: 'Ahu Ahu',
        spotId: 2015,
        lat: -39.117856,
        lng: 173.931930
    },
    aramoanaSpit: {
        name: 'Aramoana Spit',
        spotId: 4063,
        lat: -45.772796,
        lng: 170.703259
    },
    backBeach: {
        name: 'Back Beach',
        spotId: 1957,
        lat: -39.068919,
        lng: 174.017840
    },
    blacksBeach: {
        name: 'Black\'s Beach',
        spotId: 2028,
        lat: -39.068708,
        lng: 177.803179
    },
    blueDuckStream: {
        name: 'Blue Duck Stream',
        spotId: 4064,
        lat: -42.255906,
        lng: 173.809521
    },
    castlepoint: {
        name: 'Castlepoint',
        spotId: 573,
        lat: -40.896854,
        lng: 176.222082
    },
    clarenceRiver: {
        name: 'Clarence River',
        spotId: 4065,
        lat: -42.174698,
        lng: 173.931088
    },
    dinersBeach: {
        name: 'Diners Beach',
        spotId: 112,
        lat: -34.719280,
        lng: 172.928415
    },
    elliotBay: {
        name: 'Elliot Bay',
        spotId: 4066,
        lat: -34.719280,
        lng: 172.928415
    },
    fitzroyBeach: {
        name: 'Fitzroy Beach',
        spotId: 1269,
        lat: -34.719280,
        lng: 172.928415
    },
    forestry: {
        name: 'Forestry',
        spotId: 122,
        lat: -34.719280,
        lng: 172.928415
    },
    frentzesReef: {
        name: 'Frentzes Reef',
        spotId: 4067,
        lat: -34.719280,
        lng: 172.928415
    },
    gizzyPipe: {
        name: 'Gizzy Pipe',
        spotId: 110,
        lat: -34.719280,
        lng: 172.928415
    },
    goreBay: {
        name: 'Gore Bay',
        spotId: 4068,
        lat: -42.862277,
        lng: 173.312013
    },
    greenMeadows: {
        name: 'Green Meadows',
        spotId: 2024,
        lat: -34.719280,
        lng: 172.928415
    },
    greymouth: {
        name: 'Greymouth',
        spotId: 116,
        lat: -42.449502,
        lng: 171.189228
    },
    hendersonBay: {
        name: 'Henderson Bay',
        spotId: 4069,
        lat: -34.719280,
        lng: 172.928415
    },
    hickoryBay: {
        name: 'Hickory Bay',
        spotId: 4071,
        lat: -43.777409,
        lng: 173.110073
    },
    horseshoeBay: {
        name: 'Horseshoe Bay',
        spotId: 4070,
        lat: -34.719280,
        lng: 172.928415
    },
    kahutara: {
        name: 'Kahutara',
        spotId: 4072,
        lat: -42.432731,
        lng: 173.590369
    },
    karitane: {
        name: 'Karitane',
        spotId: 4073,
        lat: -45.636134,
        lng: 170.661943
    },
    komerneRoad: {
        name: 'Komerne Road',
        spotId: 2020,
        lat: -34.719280,
        lng: 172.928415
    },
    lastChance: {
        name: 'Last Chance',
        spotId: 2033,
        lat: -34.719280,
        lng: 172.928415
    },
    loisells: {
        name: 'Loisells',
        spotId: 4074,
        lat: -34.719280,
        lng: 172.928415
    },
    longPoint: {
        name: 'Long Point',
        spotId: 2025,
        lat: -34.719280,
        lng: 172.928415
    },
    lyallBay: {
        name: 'Lyall Bay',
        spotId: 107,
        lat: -41.329901,
        lng: 174.797100
    },
    magnetBay: {
        name: 'Magnet Bay',
        spotId: 4075,
        lat: -43.843443,
        lng: 172.739412
    },
    mahiaReef: {
        name: 'Mahia Reef',
        spotId: 2029,
        lat: -39.085878,
        lng: 177.866499
    },
    makaroriPoint: {
        name: 'Makarori Point',
        spotId: 4076,
        lat: -34.719280,
        lng: 172.928415
    },
    mangamanunu: {
        name: 'Mangamanunu',
        spotId: 113,
        lat: -42.303790,
        lng: 173.750049
    },
    martinsBay: {
        name: 'Martins Bay',
        spotId: 3913,
        lat: -44.359203,
        lng: 167.993750
    },
    masonBay: {
        name: 'Mason Bay',
        spotId: 3914,
        lat: -34.719280,
        lng: 172.928415
    },
    motunauBeach: {
        name: 'Motunau Beach',
        spotId: 4082,
        lat: -43.048912,
        lng: 173.067784
    },
    mountMaunganui: {
        name: 'Mount Maunganui',
        spotId: 93,
        lat: -34.719280,
        lng: 172.928415
    },
    murderers: {
        name: 'Murderers',
        spotId: 4077,
        lat: -34.719280,
        lng: 172.928415
    },
    muriwaiBeach: {
        name: 'Muriwai Beach',
        spotId: 4078,
        lat: -34.719280,
        lng: 172.928415
    },
    napier: {
        name: 'Napier',
        spotId: 132,
        lat: -34.719280,
        lng: 172.928415
    },
    newBrightonBeach: {
        name: 'New Brighton Beach',
        spotId: 114,
        lat: -43.496391,
        lng: 172.731472
    },
    newPlymouth: {
        name: 'New Plymouth',
        spotId: 104,
        lat: -34.719280,
        lng: 172.928415
    },
    northMakarori: {
        name: 'North Makarori',
        spotId: 4081,
        lat: -34.719280,
        lng: 172.928415
    },
    oakura: {
        name: 'Oakura',
        spotId: 2014,
        lat: -34.719280,
        lng: 172.928415
    },
    ohopeBeach: {
        name: 'Ohope Beach',
        spotId: 108,
        lat: -34.719280,
        lng: 172.928415
    },
    opoutama: {
        name: 'Opoutama',
        spotId: 2027,
        lat: -39.064749,
        lng: 177.855508
    },
    opunake: {
        name: 'Opunake',
        spotId: 106,
        lat: -34.719280,
        lng: 172.928415
    },
    orewaBeach: {
        name: 'Orewa Beach',
        spotId: 4079,
        lat: -34.719280,
        lng: 172.928415
    },
    owakaArea: {
        name: 'Owaka Area',
        spotId: 123,
        lat: -34.719280,
        lng: 172.928415
    },
    papamoaBeach: {
        name: 'Papamoa Beach',
        spotId: 109,
        lat: -34.719280,
        lng: 172.928415
    },
    papatowai: {
        name: 'Papatowai',
        spotId: 124,
        lat: -34.719280,
        lng: 172.928415
    },
    patauaBar: {
        name: 'Pataua Bar',
        spotId: 4080,
        lat: -34.719280,
        lng: 172.928415
    },
    piha: {
        name: 'Piha',
        spotId: 90,
        lat: -34.719280,
        lng: 172.928415
    },
    porpoiseBay: {
        name: 'Porpoise Bay',
        spotId: 3915,
        lat: -34.719280,
        lng: 172.928415
    },
    punihos: {
        name: 'Punihos',
        spotId: 2019,
        lat: -34.719280,
        lng: 172.928415
    },
    raglan: {
        name: 'Raglan',
        spotId: 91,
        lat: -34.719280,
        lng: 172.928415
    },
    railways: {
        name: 'Railways',
        spotId: 2026,
        lat: -39.074670,
        lng: 177.828051
    },
    rivertonRocks: {
        name: 'Riverton Rocks',
        spotId: 125,
        lat: -34.719280,
        lng: 172.928415
    },
    rollingStones: {
        name: 'Rolling Stones',
        spotId: 111,
        lat: -39.074372,
        lng: 177.818973
    },
    sandflyBay: {
        name: 'Sandfly Bay',
        spotId: 1953,
        lat: -45.897110,
        lng: 170.643371
    },
    scottPoint: {
        name: 'Scott Point',
        spotId: 2021,
        lat: -34.719280,
        lng: 172.928415
    },
    smailsBeach: {
        name: 'Smails Beach',
        spotId: 1952,
        lat: -45.909832,
        lng: 170.561963
    },
    spongeBay: {
        name: 'Sponge Bay',
        spotId: 1958,
        lat: -34.719280,
        lng: 172.928415
    },
    stClair: {
        name: 'St Clair',
        spotId: 115,
        lat: -45.913048,
        lng: 170.491314
    },
    stentRoad: {
        name: 'Stent Road',
        spotId: 105,
        lat: -34.719280,
        lng: 172.928415
    },
    stockRoute: {
        name: 'Stock Route',
        spotId: 1959,
        lat: -34.719280,
        lng: 172.928415
    },
    sumnerBar: {
        name: 'Sumner Bar',
        spotId: 1950,
        lat: -43.566476,
        lng: 172.763321
    },
    waitaraBar: {
        name: 'Waitara Bar',
        spotId: 2017,
        lat: -34.719280,
        lng: 172.928415
    },
    waiwakaiho: {
        name: 'Waiwakaiho',
        spotId: 1956,
        lat: -34.719280,
        lng: 172.928415
    },
    westport: {
        name: 'Westport',
        spotId: 117,
        lat: -41.751497,
        lng: 171.600625
    },
    whangamata: {
        name: 'Whangamata',
        spotId: 92,
        lat: -34.719280,
        lng: 172.928415
    }
};

