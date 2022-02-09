import {
    Basic
} from "../Basic";
import {
    Box3,
    DoubleSide,
    Matrix4,
    Vector3,
    BufferGeometry,
    EdgesGeometry,
    Float32BufferAttribute,
} from 'three';
import {
    LineGeometry
} from 'three/examples/jsm/lines/LineGeometry';
import {
    LineMaterial
} from 'three/examples/jsm/lines/LineMaterial';
import {
    LineSegmentsGeometry
} from 'three/examples/jsm/lines/LineSegmentsGeometry';
import {
    LineSegments2
} from 'three/examples/jsm/lines/LineSegments2';
import {
    Line2
} from 'three/examples/jsm/lines/Line2';

export class EdgesUtils {

    /***
     * @brief 创建LineGeometry
     */
    static createLineGeometryFromPositions(positions: number[] | Float32Array): LineGeometry {

        var lineGeometry = new LineGeometry().setPositions(positions);
        return lineGeometry;

    }

    /***
     * @brief 创建LineSegmentsGeometry
     */
    static createLineSegmentsGeometry(length: number, height: number, thickness: number): LineSegmentsGeometry {

        var trans = new Matrix4();
        var position = new Vector3(0, height * 0.5, 0);
        var scale = new Vector3(length * 0.5, height * 0.5, thickness * 0.5);
        trans.scale(scale);
        trans.setPosition(position.x, position.y, position.z);

        var positions = [
            1, 1, 1, -1, 1, 1, -1, 1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1, 1,
            1, 1, -1, -1, 1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1,
            1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1
        ];
        var geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.applyMatrix4(trans);

        var lineSegmentsGeometry = new LineSegmentsGeometry().setPositions(geometry.attributes.position.array as Float32Array);
        geometry.dispose();

        return lineSegmentsGeometry;

    }

    /***
     * @brief 从Box3创建LineSegmentsGeometry
     */
    static createLineSegmentsGeometryFromBox3(box3: Box3): LineSegmentsGeometry {

        var trans = new Matrix4();
        var position = new Vector3();
        var scale = new Vector3(0.5, 0.5, 0.5);
        if (!box3.isEmpty()) {
            box3.getCenter(position);
            box3.getSize(scale);
            scale.multiplyScalar(0.5);
        }
        trans.scale(scale);
        trans.setPosition(position.x, position.y, position.z);

        var positions = [
            1, 1, 1, -1, 1, 1, -1, 1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1, 1, 1, 1,
            1, 1, -1, -1, 1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, -1,
            1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1
        ];
        var geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.applyMatrix4(trans);

        var lineSegmentsGeometry = new LineSegmentsGeometry().setPositions(geometry.attributes.position.array as Float32Array);
        geometry.dispose();

        return lineSegmentsGeometry;

    }

    /***
     * @brief 从Positions创建LineSegmentsGeometry
     */
    static createLineSegmentsGeometryFromPositions(positions: number[] | Float32Array): LineSegmentsGeometry {

        var lineSegmentsGeometry = new LineSegmentsGeometry().setPositions(positions);
        return lineSegmentsGeometry;

    }

    /***
     * @brief 从EdgesGeometry创建LineSegmentsGeometry
     */
    static createLineSegmentsGeometryFromEdgesGeometry(edgesGeometry: EdgesGeometry): LineSegmentsGeometry {

        var lineSegmentsGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edgesGeometry);
        return lineSegmentsGeometry;

    }

    /***
     * @brief 创建LineMaterial
     */
    static createMaterial(parameters: {}): LineMaterial {

        var lineMaterial = new LineMaterial({
            color: Basic.COLOR_NORMAL_WIREFRAME_BOX,
            depthTest: true,
            depthWrite: false,
            linewidth: Basic.DEFAULT_WIREFRAME_LINE_WIDTH, // in pixels
            side: DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -2.0,
            //resolution:  // to be set by renderer, eventually
            dashed: false
        });
        if (parameters) lineMaterial.setValues(parameters);

        return lineMaterial;

    }

    static createLine2FromPositions(positions: number[] | Float32Array, parameters: {}): Line2 {

        var lineGeometry = EdgesUtils.createLineGeometryFromPositions(positions);
        var lineMaterial = EdgesUtils.createMaterial(parameters);
        var line2 = new Line2(lineGeometry, lineMaterial);

        return line2;

    }

    static createLineSegments2FromPositions(positions: number[] | Float32Array, parameters: {}): LineSegments2 {

        var lineSegmentsGeometry = EdgesUtils.createLineSegmentsGeometryFromPositions(positions);
        var lineMaterial = EdgesUtils.createMaterial(parameters);
        var lineSegments2 = new LineSegments2(lineSegmentsGeometry, lineMaterial);

        return lineSegments2;

    }

    /***
     * @brief 创建模型线框
     */
    static createWireframe(length: number, height: number, thickness: number, parameters: {}): LineSegments2 {

        var lineSegmentsGeometry = EdgesUtils.createLineSegmentsGeometry(length, height, thickness);
        var lineMaterial = EdgesUtils.createMaterial(parameters);
        var wireframe = new LineSegments2(lineSegmentsGeometry, lineMaterial);

        return wireframe;

    }

    /***
     * @brief 创建模型线框
     */
    static createWireframeFromBox3(box3: Box3, parameters: {}): LineSegments2 {

        var lineSegmentsGeometry = EdgesUtils.createLineSegmentsGeometryFromBox3(box3);
        var lineMaterial = EdgesUtils.createMaterial(parameters);
        var wireframe = new LineSegments2(lineSegmentsGeometry, lineMaterial);

        return wireframe;

    }

    /***
     * @brief 创建模型线框
     */
    static createWireframeFromEdgesGeometry(edgesGeometry: EdgesGeometry, parameters: {}): LineSegments2 {

        var lineSegmentsGeometry = EdgesUtils.createLineSegmentsGeometryFromEdgesGeometry(edgesGeometry);
        var lineMaterial = EdgesUtils.createMaterial(parameters);
        var wireframe = new LineSegments2(lineSegmentsGeometry, lineMaterial);

        return wireframe;

    }

}