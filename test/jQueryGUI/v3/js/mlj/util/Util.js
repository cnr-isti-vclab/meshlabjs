MLJ.util = {};

MLJ.util.AssociativeArray = function () {

    //Contains the keys (key = keys[0 ... _length-1])
    var keys = [];
    //Associative arrays (value = values[key]);
    var values = [];

    //The pointer class used to scan the AssociativeArray
    var _pointer = function () {
        var _ind = 0;
        this.hasNext = function () {
            return _ind < keys.length;
        };

        this.next = function () {
            var next = values[keys[_ind]];
            _ind++;
            return next;
        };
    };

    this.getByKey = function (key) {
        return values[key];
    };

    this.size = function () {
        return keys.length;
    };

    this.set = function (key, value) {

        //if key not exists
        if (!values[key]) {
            keys.push(key);
        }
        //Note that if key aleady exists, the new entry wll override the old
        values[key] = value;
    };

    this.remove = function (key) {
        delete values[key];
        for (var i = 0, m = keys.length; i < m; i++) {
            if (keys[i] === key) {
                keys.splice(i, 1);
                //we have finished
                return;
            }
        }
    };

    this.pointer = function () {
        return new _pointer();
    };
};