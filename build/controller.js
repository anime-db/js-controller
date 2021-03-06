
function extend(Child, Parent) {
    var F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}


/**
 * Controller for apply controls
 */
var Controller = function(locker) {
    this._locker = locker; // private
    this._controls = []; // private
};

Controller.prototype = {
    addControl: function(name, control) {
        if (control instanceof ControllerControl) {
            control.setController(this);
            this._controls[name] = control;
        }
        return this;
    },

    bindControl: function(target) {
        var name = target.data('control');
        if (this._controls[name] instanceof ControllerControl) {
            this._controls[name].bind(target);
        }
        return this;
    },

    bind: function(target) {
        target = $(target || 'body');

        if (target.data('control')) {
            this.bindControl(target);
        } else {
            var that = this;
            target.find('[data-control]').each(function () {
                that.bindControl($(this));
            });
        }
        return this;
    },

    getLocker: function() {
        return this._locker;
    }
};


/**
 * Controller control
 */
var ControllerControl = function() {
    this._controller = null;
};

ControllerControl.prototype = {
    setController: function(controller) {
        this._controller = controller;
    },

    getController: function() {
        return this._controller;
    },

    bind: function(target) {
        throw new Error('Must be implemented');
    }
};

/**
 * Util for lock page and element on page
 */
var Locker = function() {
    this._is_lock = false; // private
    this._body = $('body'); // private
};

Locker.prototype = {
    lock: function(el) {
        this._is_lock = true;
        this._body.addClass('locker_wait');
        if (el) {
            el.addClass('locker_lock');
        }
    },

    unlock: function(el) {
        this._is_lock = false;
        this._body.removeClass('locker_wait');
        if (el) {
            el.removeClass('locker_lock');
        }
    },

    isLock: function()
    {
        return this._is_lock;
    }
};
