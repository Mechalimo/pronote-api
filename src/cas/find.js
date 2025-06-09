const http = require('./http');

const URLS = {
    'ac-dijon': 'cas.eclat-bfc.fr',
    'ac-grenoble': 'cas.ent.auvergnerhonealpes.fr',
    'ac-lille': 'cas.savoirsnumeriques62.fr',
    'ac-lille2': 'teleservices.ac-lille.fr',
    'ac-limoges': 'mon.lyceeconnecte.fr',
    'ac-lyon': 'cas.ent.auvergnerhonealpes.fr',
    'ac-montpellier': 'cas.mon-ent-occitanie.fr',
    'ac-nancy-metz': 'cas.monbureaunumerique.fr',
    'ac-nantes': 'cas3.e-lyco.fr',
    'ac-orleans-tours': 'ent.netocentre.fr',
    'ac-poitiers': 'mon.lyceeconnecte.fr',
    'ac-reims': 'cas.monbureaunumerique.fr',
    'ac-rouen': 'nero.l-educdenormandie.fr',
    'ac-strasbourg': 'cas.monbureaunumerique.fr',
    'ac-toulouse': 'cas.mon-ent-occitanie.fr',
    'ac-valdoise': 'cas.moncollege.valdoise.fr',
    'agora06': 'cas.agora06.fr',
    'arsene76': 'cas.arsene76.fr',
    'atrium-sud': 'www.atrium-sud.fr',
    'cybercolleges42': 'cas.cybercolleges42.fr',
    'eure-normandie': 'cas.ent27.fr',
    'haute-garonne': 'cas.ecollege.haute-garonne.fr',
    'hdf': 'enthdf.fr',
    'iledefrance': 'ent.iledefrance.fr',
    'moncollege-essonne': 'www.moncollege-ent.essonne.fr',
    'laclasse': 'www.laclasse.com',
    'ljr-munich': 'cas.kosmoseducation.com',
    'lyceeconnecte': 'mon.lyceeconnecte.fr',
    'parisclassenumerique': 'ent.parisclassenumerique.fr',
    'portail-famille': 'seshat.ac-orleans-tours.fr:8443',
    'seine-et-marne': 'ent77.seine-et-marne.fr',
    'somme': 'college.entsomme.fr',
    'toutatice': 'www.toutatice.fr',
    'monbureaunumerique-educonnect': 'cas.monbureaunumerique.fr'
};

async function find(url)
{
    if (!url.endsWith('/')) {
        url += '/';
    }

    let location;
    try {
        location = await http({ url: url + 'eleve.html', followRedirects: 'get' });
    } catch (err) {
        // En cas d'erreur réseau ou HTTP, on retourne null ou une valeur qui évite l'erreur d'usage
        return null;
    }

    // Correction ici : on vérifie que location est bien une string avant d'appeler includes
    if (!location || typeof location !== 'string') {
        return 'none';
    }

    if (location.includes('<head>')) {
        return 'none';
    }

    if (location.startsWith('http://') || location.startsWith('https://')) {
        location = location.substring(location.indexOf('/') + 2);
    }

    const host = location.substring(0, location.indexOf('/'));

    const result = [];
    for (const [name, casHost] of Object.entries(URLS)) {
        if (host === casHost) {
            result.push(name);
        }
    }

    if (result.length === 0) {
        return null;
    }

    if (result.length === 1) {
        return result[0];
    }

    return result;
}

module.exports = find;
