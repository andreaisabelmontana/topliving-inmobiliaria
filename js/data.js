/* ============================================================
   Property catalog — Top Living Inmobiliaria
   In a real build this would be served by the Flask API
   (app/main.py). For GitHub Pages we ship it as static data
   so the catalog is fully interactive client-side.
   ============================================================ */

window.PROPERTIES = [
    {
        id: "TL-001",
        title: "Apartamento moderno en Chicó",
        type: "apartment",
        op: "sale",
        city: "Bogotá",
        neighborhood: "Chicó Norte",
        price: 980000000,
        currency: "COP",
        beds: 3,
        baths: 2,
        area: 112,
        parking: 2,
        year: 2021,
        badge: "Destacado",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"
        ],
        description: "Apartamento de tres habitaciones en uno de los sectores más exclusivos de Bogotá. Acabados premium, cocina abierta, balcón con vista a la sabana y dos parqueaderos. Edificio con gimnasio, salón social y portería 24/7."
    },
    {
        id: "TL-002",
        title: "Casa campestre en La Calera",
        type: "house",
        op: "sale",
        city: "La Calera",
        neighborhood: "Vía La Calera",
        price: 1450000000,
        currency: "COP",
        beds: 4,
        baths: 4,
        area: 320,
        parking: 4,
        year: 2018,
        badge: "Nuevo",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80"
        ],
        description: "Casa de cuatro habitaciones sobre 1.200 m² de lote con jardín, terraza con chimenea y vista a la montaña. Salón doble altura, cocina tipo isla y habitación de servicio independiente."
    },
    {
        id: "TL-003",
        title: "Penthouse con vista en Usaquén",
        type: "apartment",
        op: "sale",
        city: "Bogotá",
        neighborhood: "Usaquén",
        price: 2100000000,
        currency: "COP",
        beds: 4,
        baths: 4,
        area: 220,
        parking: 3,
        year: 2022,
        badge: "Premium",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"
        ],
        description: "Penthouse en último piso con terraza privada de 80 m², jacuzzi y vista 270° sobre Bogotá. Sistema domótico integrado, calefacción central y closet vestier en la habitación principal."
    },
    {
        id: "TL-004",
        title: "Apartaestudio en El Poblado",
        type: "studio",
        op: "rent",
        city: "Medellín",
        neighborhood: "El Poblado",
        price: 2800000,
        currency: "COP",
        beds: 1,
        baths: 1,
        area: 45,
        parking: 1,
        year: 2020,
        badge: "Arriendo",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80"
        ],
        description: "Apartaestudio amoblado en torre moderna del Poblado. Incluye administración, internet y servicios. Acceso a piscina, gimnasio y coworking. Ideal para profesionales o expatriados."
    },
    {
        id: "TL-005",
        title: "Casa frente al mar — Cartagena",
        type: "house",
        op: "sale",
        city: "Cartagena",
        neighborhood: "Bocagrande",
        price: 3200000000,
        currency: "COP",
        beds: 5,
        baths: 5,
        area: 410,
        parking: 4,
        year: 2019,
        badge: "Premium",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80"
        ],
        description: "Casa frente al mar con cinco habitaciones, piscina infinita y acceso directo a la playa. Arquitectura contemporánea con grandes ventanales y materiales nobles."
    },
    {
        id: "TL-006",
        title: "Oficina A+ en Zona Rosa",
        type: "office",
        op: "rent",
        city: "Bogotá",
        neighborhood: "Zona Rosa",
        price: 9500000,
        currency: "COP",
        beds: 0,
        baths: 2,
        area: 180,
        parking: 3,
        year: 2017,
        badge: "Arriendo",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
        ],
        description: "Oficina abierta de 180 m² en edificio LEED Gold. Cuatro salas de reuniones, recepción, kitchenette y vista hacia el parque de la 93. Acceso 24/7."
    },
    {
        id: "TL-007",
        title: "Loft industrial en Laureles",
        type: "apartment",
        op: "sale",
        city: "Medellín",
        neighborhood: "Laureles",
        price: 620000000,
        currency: "COP",
        beds: 2,
        baths: 2,
        area: 95,
        parking: 1,
        year: 2020,
        badge: "Destacado",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"
        ],
        description: "Loft de dos niveles con doble altura, acabados industriales, cocina abierta y mezzanine como estudio. Edificio con terraza social y huerta urbana."
    },
    {
        id: "TL-008",
        title: "Apartamento familiar en Cedritos",
        type: "apartment",
        op: "rent",
        city: "Bogotá",
        neighborhood: "Cedritos",
        price: 3900000,
        currency: "COP",
        beds: 3,
        baths: 2,
        area: 105,
        parking: 1,
        year: 2015,
        badge: "Arriendo",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
        ],
        description: "Apartamento de tres habitaciones, cocina integral, balcón y dos baños. Conjunto cerrado con piscina, salón comunal y BBQ. Cerca al colegio Andino y al CC Santafé."
    },
    {
        id: "TL-009",
        title: "Lote campestre en Llanogrande",
        type: "lot",
        op: "sale",
        city: "Rionegro",
        neighborhood: "Llanogrande",
        price: 480000000,
        currency: "COP",
        beds: 0,
        baths: 0,
        area: 2500,
        parking: 0,
        year: null,
        badge: "Nuevo",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80"
        ],
        description: "Lote campestre de 2.500 m² en parcelación cerrada de Llanogrande. Servicios públicos disponibles, vías pavimentadas y club house comunal. Apto para construir hasta 600 m²."
    }
];
