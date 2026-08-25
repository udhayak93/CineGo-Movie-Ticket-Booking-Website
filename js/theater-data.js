const theatres = [

    {
        id: "pvr-grand",
        name: "PVR Grand Mall, Velachery, Chennai",
        shortName: "PVR Velachery",
        logo: "https://cdn.district.in/movies-assets/images/cinema/PVR%20circle%20new-e63c67e0-a41d-11ef-8d2a-13243c787688.png",
        image: "https://png.pngtree.com/thumb_back/fh260/background/20230630/pngtree-d-rendering-of-cinema-seating-and-screen-with-copy-space-perfect-image_3699237.jpg",
        distance: "0.3 km Away",
        cancel: "Cancellation Available",
        format: "2D",
        price: 250,
        couple: true,
        wheelchair: true,
        recliner: false
    },
    {
        id: "inox-phoenix",
        name: "INOX Phoenix Market City, Velachery, Chennai",
        shortName: "INOX Phoenix",
        logo: "https://cdn.district.in/movies-assets/images/cinema/inox-circle%202-27a89af0-a41e-11ef-8d2a-13243c787688.png",
        image: "https://png.pngtree.com/thumb_back/fh260/background/20230630/pngtree-d-rendering-of-cinema-seating-and-screen-with-copy-space-perfect-image_3699237.jpg",
        distance: "1.8 km Away",
        cancel: "Cancellation Available",
        format: "IMAX",
        price: 450,
        couple: false,
        wheelchair: true,
        recliner: true
    },

    {
        id: "sangam",
        name: "Sangam Cinemas 4K RGB Laser Dolby Atmos, Kilpauk, Chennai",
        shortName: "Sangam",
        logo: "https://cdn.district.in/movies-assets/images/cinema/Sangam-84fd3830-a975-11ef-9776-1b4f9b330164.png",
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGhlYXRlcnxlbnwwfHwwfHx8MA%3D%3D",
        distance: "12.4 km Away",
        cancel: "Non-cancellable",
        format: "4DX",
        price: 350,
        couple: true,
        wheelchair: true,
        recliner: true
    },

    {
        id: "kamala",
        name: "Kamala Cinemas 4K RGB Laser Dolby, Vadapalani, Chennai",
        shortName: "Kamala",
        logo: "https://cdn.district.in/movies-assets/images/cinema/Kamala-Cinemas--588efcb0-b800-11ed-aa6d-d31156ec62e3.png",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUHNM7x3HvsMwq7dr1UDRpAoZDYpwXhnycRse5LeFYSwydaD5Z03Wr6C8&s=10",
        distance: "8.6 km Away",
        cancel: "Non-cancellable",
        format: "2D",
        price: 200,
        couple: true,
        wheelchair: true,
        recliner: true
    },

    {
        id: "vettri",
        name: "Vettri Theaters RGB Laser, Chrompet, Chennai",
        shortName: "Vettri",
        logo: "https://cdn.district.in/movies-assets/images/cinema/Vettri-Theatre--1ac613a0-b7f6-11ed-9452-d9fc8dc00535.png",
        image: "https://cpimg.tistatic.com/9514373/b/4/prime-slider-cr-theater-chair.jpeg",
        distance: "8.8 km Away",
        cancel: "Non-cancellable",
        format: "2D",
        price: 180,
        couple: true,
        wheelchair: false,
        recliner: false
    },

    {
        id: "kasi",
        name: "Kasi RGB Laser Dolby Atmos, Ashok Nagar, Chennai",
        shortName: "Kasi",
        logo: "https://cdn.district.in/movies-assets/images/cinema/Kasi-Theatre--d8fcf380-b7f5-11ed-9452-d9fc8dc00535.png",
        image: "https://png.pngtree.com/thumb_back/fh260/background/20230630/pngtree-d-rendering-of-cinema-seating-and-screen-with-copy-space-perfect-image_3699237.jpg",
        distance: "6.2 km Away",
        cancel: "Non-cancellable",
        format: "2D",
        price: 220,
        couple: false,
        wheelchair: true,
        recliner: false
    },

    {
        id: "rakki",
        name: "Rakki RGB Laser 4K, Ambattur, Chennai",
        shortName: "Rakki",
        logo: "https://cdn.district.in/movies-assets/images/cinema/Rakki-Cinema-lgo%20(1)-2cc3a940-52b3-11f1-b320-51ddd3a8a418.jpg",
        image: "https://png.pngtree.com/thumb_back/fh260/background/20230630/pngtree-d-rendering-of-cinema-seating-and-screen-with-copy-space-perfect-image_3699237.jpg",
        distance: "18.2 km Away",
        cancel: "Non-cancellable",
        format: "4DX",
        price: 300,
        couple: true,
        wheelchair: true,
        recliner: true
    },

    {
        id: "seven-screen",
        name: "Seven Screen's Cinemas, Kilambakkam, Chennai",
        shortName: "Seven Screens",
        logo: "https://cdn.district.in/movies-assets/images/cinema/Seven-Screen's-Cinemas_Cinema-Icon-32b20c60-ec7a-11f0-a8ca-8ddfcd51cff7.png",
        image: "https://png.pngtree.com/thumb_back/fh260/background/20230630/pngtree-d-rendering-of-cinema-seating-and-screen-with-copy-space-perfect-image_3699237.jpg",
        distance: "19.2 km Away",
        cancel: "Non-cancellable",
        format: "IMAX",
        price: 400,
        couple: true,
        wheelchair: true,
        recliner: true
    },

    {
        id: "murugan",
        name: "Murugan Cinemas, Chennai",
        shortName: "Murugan",
        logo: "https://cdn.district.in/movies-assets/images/cinema/Murugan-cinema-ambattur-9d506350-cdfb-11ed-9242-39e1a294ee84%5B1%5D-5fd9db90-e7b3-11ef-92d2-15600bedb040.png?im=Resize,width=320",
        image: "https://png.pngtree.com/thumb_back/fh260/background/20230630/pngtree-d-rendering-of-cinema-seating-and-screen-with-copy-space-perfect-image_3699237.jpg",
        distance: "10 km Away",
        cancel: "Non-cancellable",
        format: "2D",
        price: 150,
        couple: false,
        wheelchair: true,
        recliner: false
    }

];

