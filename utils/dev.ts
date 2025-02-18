

export function highlightedLog(title: string, message: any, type: string = 'log') {
    switch (type) {
        case 'log':
            console.log(`== start ${title} ===================================`);
            console.log(`= ${type} == ${title}: `, message);
            console.log(`== end ${title} =====================================`);
            break;
        case 'error':
            console.error(`== start ${title} =================================`);
            console.error(`= ${type} == ${title}: `, message);
            console.error(`== end ${title} ===================================`);
    }
}


export function formatDate(dateISO: Date) {
    const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

    const dateObj = new Date(dateISO);
    const day = days[dateObj.getDay()];
    const day_number = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${day} ${day_number} ${month} ${year}`;
}

// function convertirDate(dateISO: Date) {
//     const dateObj = new Date(dateISO);
//     const jour = dateObj.getDate();
//     const mois = dateObj.getMonth() + 1;
//     const annee = dateObj.getFullYear();
//     return `${jour}/${mois}/${annee}`;
// }



export function getNestedValue(obj: any, path: string): any {
    // Gère les cas où le chemin est vide ou l'objet est null
    if (!path || !obj) return null;

    // Divise le chemin en parties (ex: "user.first_name" -> ["user", "first_name"])
    const parts = path.split('.');

    // Réduit le chemin pour accéder à la valeur finale
    return parts.reduce((value, key) => {
        // Retourne null si une partie intermédiaire est null ou undefined
        return value ? value[key] : null;
    }, obj);
}