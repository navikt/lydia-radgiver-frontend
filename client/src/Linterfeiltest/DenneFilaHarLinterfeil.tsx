import React from "react";

export const denneFunksjonenErIndentetForKort = () => {
  return <div>Denne fila har linterfeil</div>;
};

export const denneFunksjonenErIndentetForLangt = () => {
        return <div>Denne fila har linterfeil</div>;
};

export const denneFunksjonenErIkkeIndentet = () => {
return <div>Denne fila har linterfeil</div>;
};





export const denneFunksjonenHarForMyeMellomromOverSeg = () => {
    return <div>Denne fila har linterfeil</div>;
};

export const denneFunksjonenHarMasseTeitMellomromInni = () => {
  const [erKlikket, setErKlikket] =         React.useState(false);


        // Lurer på hva som skjer når vi formaterer dette dokumentet...






  return <div>
    {erKlikket ? <div>Knappen ble klikket</div> : <div>Knappen har ikke blitt klikket</div>}
    <button onClick={()    => setErKlikket(true)}>Klikk</button>
    </div>;
};