const SUPABASE_URL =
"https://xxnvsphhmpsegxqaoccg.supabase.co";

const SUPABASE_KEY =
"sb_publishable_4Ads26USRet1OK7ZAa9n4Q_1BuuL_aN";

const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function consultarRegistro(){

    const clurw =
    document
    .getElementById(
        "buscarCLURW"
    )
    .value
    .trim()
    .toUpperCase();

    if(!clurw){

        alert(
            "Ingrese una CLURW"
        );

        return;
    }

    const {

        data,

        error

    } = await supabaseClient

    .from("registros_web")

    .select("*")

    .eq(
        "clurw",
        clurw
    )

    .single();

    if(error){

        alert(
            "Registro no encontrado"
        );

        return;
    }

    document.getElementById(
        "resultadoCard"
    ).style.display =
    "block";

    document.getElementById(
        "r_constancia"
    ).textContent =
    data.constancia_alta;

    document.getElementById(
        "r_clurw"
    ).textContent =
    data.clurw;

    document.getElementById(
        "r_pagina"
    ).textContent =
    data.nombre_pagina;

    document.getElementById(
        "r_propietario"
    ).textContent =
    data.propietario;

    document.getElementById(
        "r_empresa"
    ).textContent =
    data.empresa;

    document.getElementById(
        "r_fecha"
    ).textContent =
    data.fecha_registro;

    document.getElementById(
        "r_pago"
    ).textContent =
    data.estatus_pago;

    document.getElementById(
        "r_estatus"
    ).textContent =
    data.estatus_sistema;

}