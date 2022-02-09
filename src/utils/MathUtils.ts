export class MathUtils {

    
    static lerp(a:number, b:number, t:number) {

        return (1 - t) * a + t * b;

    }

    static inverseLerp(a:number, b:number, value:number) {

        if (a !== b) {
            return (value - a) / (b - a);
        } else {
            return 0;
        }

    }
}