import { Basic } from "../Basic";

export class PageObj   {

    // private model:Mesh;

    constructor() {
        // super();
        // let geometry = new BoxGeometry(1,1,1);
        // // var material = new MeshStandardMaterial({ color: "#ff0000" });
        // let material = new MeshBasicMaterial({
        //     color: "#ff0000",
        //     opacity: .1,
        //     transparent: true
        // });
        // this.model = new Mesh(geometry, material);
        // this.model.position.y = -100;
        // this.setSize(1, 1);

        // this.add(this.model);
    }

    setSize(w:number, h:number) {
        // this.model.scale.set(w/Basic.DEFAULT_UNIT_LENGTH_m, 1, h/Basic.DEFAULT_UNIT_LENGTH_m);
    }
}