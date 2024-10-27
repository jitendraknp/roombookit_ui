( function () {
    if ( !Element.prototype.prepend ) {
        Element.prototype.prepend = function ( ...nodes: ( Node | string )[] ) {
            // Convert string inputs to Text nodes
            const elements: Node[] = nodes.map( node => {
                if ( typeof node === 'string' ) {
                    return document.createTextNode( node );
                }
                return node;
            } );

            // Insert the nodes into the element
            for ( const element of elements ) {
                this.insertBefore( element, this.firstChild );
            }
        };
    }
} )();