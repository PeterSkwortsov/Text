

export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path: 
        [
            'static/textures/box/nx.png',
            'static/textures/box/ny.png',
            'static/textures/box/nz.png',
            'static/textures/box/px.png',
            'static/textures/box/py.png',
            'static/textures/box/pz.png',
        ]
    },

    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'static/textures/floor/rocky_terrain_diff_1k.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'static/textures/floor/rocky_terrain_nor_gl_1k.jpg'
    },
    {
        name: 'foxModel',
        type: 'gltfModel',
        path: 'static/Fox/Fox.gltf'
    }

]