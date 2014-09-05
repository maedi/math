$(document).ready(function(){
	
	setClickable();
	behaviour();
	updateLoop();
});

function setClickable() {

	$('.editme').click(function() {
	
		var revert = $(this).html();

		var class;
		
		if($(this).hasClass('number')) {
		
			class = 'number';
		}
		else {
		
			class = 'operator';
		}		

		var textarea = '<span class="' + class + '" id="editme"><textarea rows="1" cols="3">'+$(this).html()+'</textarea>';
		var button	 = '<input type="button" value="Save" class="saveButton" /> or <input type="button" value="Cancel" class="cancelButton" /></span>';
		
		$(this).replaceWith(textarea+button);
		
	
		// save
		$('.saveButton').click(function() {saveChanges(this, false, class); });
		
		
		// cancel
		$('.cancelButton').click(function(){
	
			$(this).parent().replaceWith('<span class="' + class + ' editme">' + revert + '</span>');
			setClickable();
	
		});
	
			
		}).mouseover(function() {
			$(this).addClass("editable");
		})
		.mouseout(function() {
			$(this).removeClass("editable");
	});
};

function saveChanges(obj, cancel, class) {

	var t = $('textarea').val();
	
	// pretty up input
	if(t == '/') {
	
		var class = class + ' divide';
		t = '&divide;';
	}
	
	$(obj).parent().replaceWith('<span class="' + class + ' editme">' + t + '</span>');

	setClickable();
	updateLoop();

}

function updateLoop() {
	
	$('.object').each(function(a) {
	
		var object;
		var parent;
		var child;
	
		$("input", this).each(function(b) {
		
			// load object
			object = $(this).parent();

			// load parent
			if ($(this).hasClass('parent')) {
			
				var parentid = $(this).attr("value");
				parent = $('#' + parentid);
						
				//alert(a + '-' + b + ':' + parentid);
			};
			
			// load child
			if ($(this).hasClass('child')) {
			
				var childid = $(this).attr("value");
				child = $('#' + childid);
			};
			
		});

		calc(object, parent, child);

	});
}


function calc(object, parent, child) {

	var p_numberfield = $('.number', parent).text();
	if(p_numberfield) {
		var p_number = parseInt(/(\d+)/.exec(p_numberfield)[0], 10);
	}
	
	
	var sign = $('.operator', object).text()
	
	var numberfield = $('.number', object).text();
	if(numberfield) {
		var number = parseInt(/(\d+)/.exec(numberfield)[0], 10);
	}
	
		
	var print;

	if ($('.operator', object).hasClass('times')) {
		
		print = p_number * number;

		if ($('.result', parent).hasClass('result')) {
			
			var p_result = $('.result', parent).text();

			print = p_result * number;
		}
	}

	if ($('.operator', object).hasClass('divide')) {
		
		print = p_number / number;

		if ($('.result', parent).hasClass('result')) {
			
			var p_result = $('.result', parent).text();

			print = p_result / number;
		}
	}

	$('.result', object).text(print)

}


function behaviour() {

		
	// when this object is deleted....
	$('.delete').click(function() {

		var object = $(this).parent();

		var child_id = $('.child', object).attr("value");
		var parent_id = $('.parent', object).attr("value");

		var child = $('#' + child_id);
		var parent = $('#' + parent_id);

		
		// update parent with new child
		$('.child', parent).val(child_id);
		
		// update child with new parent
		$('.parent', child).val(parent_id);
		
		
		$(this).parent().toggle('slide');
		//$(this).parent().timer(300, function() { $(this).parent().remove(); });
		$(this).parent().remove();
		
		updateLoop()
		
	});

	// when object is created....
	$('.new').click(function() {

		var parent = $(this).prev();
		var parentid = parseInt(parent.attr('id'));
		var newid = parseInt(parent.attr('id')) + 1;
		
		// update parent with new child
		$('.child', parent).val(newid);
				
		// create new child
		$('.new').before('\
		\
			<div class="object" id="' + newid + '">\
			\
				<a class="delete" href="#"></a>\
				\
				<input class="parent" type="hidden" name="parent" value="' + parentid + '">\
				\
				<span class="operator times editme">&times;</span>\
				\
				<span class="number editme">2</span>\
				\
				<span class="result">0</span>\
				\
			</div>\
		\
		');
		
		setClickable();
		behaviour();
		updateLoop();
		
	});

};