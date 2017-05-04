require.config({
    paths: {
        detector:'cloud/Detector',
        three:'cloud/three.min',
        cloud:'cloud',
        marked:'marked',
        prism:'prism',
        pubu:'pubu',
        utils:'utils'
    },
    shim:{
        // 'utils':{
        //     exports:'utils'
        // },
        'pubu':{
            exports:'pubu'
        },
        'cloud':{
            deps:['detector','three'],
            exports:'cloud'
        }
        // ,
        // 'main':{
        //     deps:['cloud','marked','prism','pubu','utils'],
        //     exports:'main'
        // }
    }
});
