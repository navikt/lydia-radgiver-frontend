const feilHåndtering = (feil: Error) => {
    return new ApiResultat({
        feilmelding: "Feil under request"
    })
}

export const get = async <T>(url: string, headers? : Record<string, string>) : Promise<ApiResultat<T | ApiFeil >> => {
    const options = {
        method: 'GET',
        headers : headers
    }
    return fetch(url, options)
        .then((respons : Response) => respons.json())
        .then(responsData => new ApiResultat<T>(responsData.json() as T))
        .catch(feilHåndtering)
          
}

export class ApiResultat<T> {
    private data : T | ApiFeil
    constructor(data : T | ApiFeil) {
        this.data = data
    }

    hentData() : T {
        return this.data as T
    }

    isOk() : boolean {
        return !this.isFeil()  
    }

    isFeil() : boolean {
        return (this.data as ApiFeil).feilmelding !== undefined
    }
}


export type ApiFeil = {
    feilmelding : string
}