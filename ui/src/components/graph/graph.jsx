import React, { useState, useRef, useEffect } from 'react';
import { createEmptyGraph } from '../../services/graph-creator-service';
import CytoscapeComponent from 'react-cytoscapejs';
const { Game } = require('../../../../game/Game.js');

const WIDTH = 600;
const HEIGHT = 600;
const R = 200;
export function Graph({ elements, onEdgeTap, onNodeTap, onTap, unselectify }) {
    let cytoscapeRef = useRef(null);

    useEffect(() => {
        if (cytoscapeRef) {
            cytoscapeRef.autounselectify(unselectify);
        }
    }, [unselectify])

    useEffect(() => {
        if (cytoscapeRef) {
            cytoscapeRef.boxSelectionEnabled(false);
            cytoscapeRef.on('tap', 'edge', event => onEdgeTap(event));
            cytoscapeRef.on('tap', 'node', (event) => {
                const edgeCreated = onNodeTap(event);
                if (edgeCreated) {
                    cytoscapeRef.one('select', () => {
                        cytoscapeRef.$(':selected').unselect();
                    });
                }
            });
            cytoscapeRef.on('tap', (event) => {
                onTap(event);
            });
        }
    }, [cytoscapeRef]);
    return (
        <CytoscapeComponent elements={elements}
            cy={(cy) => { cytoscapeRef = cy }}
            panningEnabled={false}
            zoomingEnabled={false}
            autolock={true}
            style={{ width: `${WIDTH}px`, height: `${HEIGHT}px` }}
            stylesheet={[
                {
                    selector: 'edge',
                    style: {
                        lineColor: "data(edgeColor)",
                        width: "data(width)"
                    }
                }
            ]}>
        </CytoscapeComponent>
    )
}