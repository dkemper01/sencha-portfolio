Ext.define('splitViewPortfolio.model.App', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'id',          type: 'string'},
            {name: 'text',        type: 'string'},
            {name: 'source',      type: 'string'},
            {name: 'animation',   type: 'auto'},
            {name: 'limit',       type: 'auto'},
            {name: 'preventHide', type: 'boolean'},
            {name: 'view',        type: 'string'},
            {name: 'imgsrc',      type: 'string'}
        ]
    }
});
