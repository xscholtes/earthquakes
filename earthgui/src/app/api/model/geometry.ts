/**
 * earthquakeapi
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { Coordinate } from './coordinate';
import { Dimension } from './dimension';
import { Envelope } from './envelope';
import { GeometryFactory } from './geometryFactory';
import { OgcGeometryType } from './ogcGeometryType';
import { Point } from './point';
import { PrecisionModel } from './precisionModel';

export interface Geometry { 
    factory?: GeometryFactory;
    userData?: any;
    srid?: number;
    readonly geometryType?: string;
    ogcGeometryType?: OgcGeometryType;
    precisionModel?: PrecisionModel;
    coordinate?: Coordinate;
    readonly coordinates?: Array<Coordinate>;
    readonly numPoints?: number;
    readonly numGeometries?: number;
    readonly isSimple?: boolean;
    readonly isValid?: boolean;
    readonly isEmpty?: boolean;
    readonly area?: number;
    readonly length?: number;
    centroid?: Point;
    interiorPoint?: Point;
    pointOnSurface?: Point;
    dimension?: Dimension;
    boundary?: Geometry;
    boundaryDimension?: Dimension;
    envelope?: Geometry;
    envelopeInternal?: Envelope;
    readonly isRectangle?: boolean;
}