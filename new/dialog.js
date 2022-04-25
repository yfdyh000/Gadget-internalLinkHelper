// Example: Creating and opening a process dialog window. 

// Subclass ProcessDialog.
function ProcessDialog( config ) {
	ProcessDialog.super.call( this, config );
}
OO.inheritClass( ProcessDialog, OO.ui.ProcessDialog );

// Specify a name for .addWindows()
ProcessDialog.static.name = 'myDialog';
// Specify a static title and actions.
ProcessDialog.static.title = '效果设置';
ProcessDialog.static.actions = [
	/*{
		action: 'Save',
		label: '保存但不刷新页面',
		flags: ''
	},*/
	{
		action: 'Apply',
		label: '保存并刷新页面',
		flags: ['primary', 'progressive']
	},
	{
		label: '取消',
		flags: ['safe', 'close']
	}
];

// Use the initialize() method to add content to the dialog's $body,
// to initialize widgets, and to set up event handlers.
ProcessDialog.prototype.initialize = function () {
	ProcessDialog.super.prototype.initialize.apply( this, arguments );

    this.dropdown = new OO.ui.DropdownWidget( {
        menu: {
            items: [
                new OO.ui.MenuOptionWidget( {
                    data: 'disabled',
                    label: 'disabled',
                    indicator: 'clear'
                } ),
                new OO.ui.MenuOptionWidget( {
                    data: 'redonly',
                    label: 'redonly'
                } ),
                new OO.ui.MenuOptionWidget( {
                    data: 'redtipsy',
                    label: 'redtipsy',
                    indicator: 'required'
                } ),
                new OO.ui.MenuOptionWidget( {
                    data: 'redplain',
                    label: 'redplain'
                } ),
                new OO.ui.MenuOptionWidget( {
                    data: 'external',
                    label: 'external'
                } ),
                new OO.ui.MenuOptionWidget( {
                    data: 'suffix',
                    label: 'suffix'
                } ),
                new OO.ui.MenuOptionWidget( {
                    data: 'cravix',
                    label: 'cravix'
                } ),
                new OO.ui.MenuOptionWidget( {
                    data: 'altcolor',
                    label: 'altcolor'
                } ),
                new OO.ui.MenuOptionWidget( {
                    data: 'ilbluehl',
                    label: 'ilbluehl'
                } ),
            ]
        }
    } )
	this.content = new OO.ui.PanelLayout( {
		padded: true,
		expanded: false
	} );
	//this.content.$element.append( '<p>This is a process dialog window. The header contains the title and two buttons: \'Cancel\' (a safe action) on the left and \'Done\' (a primary action) on the right. </p>' );
    this.content.$element.append(this.dropdown.$element)

	this.$body.append( this.content.$element );
    this.dropdown.getMenu().selectItemByData( 'redtipsy' );
};

// mw.user.options for sync preference from gadget?

// Use the getActionProcess() method to specify a process to handle the
// actions (for the 'save' action, in this example).
ProcessDialog.prototype.getActionProcess = function ( action ) {
	var dialog = this;
	if ( action ) {
		return new OO.ui.Process( function () {
            dialog.dropdown.getMenu().findSelectedItem().getData();
            dialog.close( {
				action: action
			} );
		} );
	}
// Fallback to parent handler.
	return ProcessDialog.super.prototype.getActionProcess.call( this, action );
};
ProcessDialog.prototype.getBodyHeight = function () {
	return 380;
};

// Create and append the window manager.
var windowManager = new OO.ui.WindowManager();
$( document.body ).append( windowManager.$element );

// Create a new dialog window.
var processDialog = new ProcessDialog({
	size: 'medium'
});

// Add windows to window manager using the addWindows() method.
windowManager.addWindows( [ processDialog ] );

// Open the window.
windowManager.openWindow( processDialog );