import * as $ from "jquery";
import { DirectedEdgeId } from "./DirectedEdgeId";
import { TrafficCountTree } from "./TrafficCountTree";
import { TreeEdge } from "./TreeEdge";

export class TrafficCountsApi {
    url: string;
    key: string;

    constructor(url: string, key?: string) {
        this.url = url;
        this.key = key;
    }

    mvtUrl(): string {
        return `${ this.url }/tiles/mvt.json`;
    }

    getTree(directedEdgeId: DirectedEdgeId, callback: (tree: TrafficCountTree) => void) {
        $.get(this.url + '/trees/' + directedEdgeId.Id(), (data) => {
            var count = Number(data.count);
            var directedEdgeId = Number(data.id);

            // parse origin tree.
            var originTree: { [key: number]: TreeEdge; } = {};
            if (data.origins) {
                for (const c in data.origins) {
                    var e = Number(c);
                    var origin = data.origins[c];

                    var count = Number(origin.count);
                    var edges: number[] = [];
                
                    if (origin.edges) {
                        origin.edges.forEach(e => {
                            edges.push(Number(e));
                        });
                    }
                    
                    originTree[e] = {
                        count: count,
                        edges: edges
                    };
                }
            }

            // parse destination tree.
            var destinationTree: { [key: number]: TreeEdge; } = {};
            if (data.destinations) {
                for (const c in data.destinations) {
                    var e = Number(c);
                    var destination = data.destinations[c];

                    var count = Number(destination.count);
                    var edges: number[] = [];
                
                    if (destination.edges) {
                        destination.edges.forEach(e => {
                            edges.push(Number(e));
                        });
                    }
                    
                    destinationTree[e] = {
                        count: count,
                        edges: edges
                    };
                }
            }

            callback(new TrafficCountTree(directedEdgeId, count, 
                originTree, destinationTree));
        });
    }
}