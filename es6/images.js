//Images
export const getImages = (render) => {

    const images = {
        background: new Image(),
        foreground: new Image(),
        aim: new Image(),
        shells: new Image(),
        target: {
            0: new Image(),
            1: new Image(),
            2: new Image(),
        },
    };

    images.background.onload = render;
    images.background.src = 'assets/drones/background2.jpg';
    images.foreground.onload = render;
    images.foreground.src = 'assets/drones/foreground.png';
    images.shells.src = 'assets/ducks/shells.png';
    images.aim.src = 'assets/ducks/muzzelFlash.png';
    images.target[0].src = 'assets/drones/drone1.png';
    images.target[1].src = 'assets/drones/drone2.png';
    images.target[2].src = 'assets/drones/drone3.png';
    return images;
}
