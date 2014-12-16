$(function(){

	var generator = $("meta[name=generator]").attr("content");
	var version = generator.split(" ")[1];
	console.log("Scene exporter with", generator);

	var c_layers = [];
	var li = $("<li class='divider'></li><li><svg class='layers' width='125' height='45'></svg></li><li class='divider'></li>");
	$(".top-bar-section .left").append(li) ;
	var svg = $("svg.layers");

	function updateLayers() {
		svg.children("rect").each(function(i) {
			if (c_layers[i].active) {
				this.classList.add("active");
				//console.log("TRUE: group.layer-" + i + " > model)", document.querySelectorAll("group.layer-" + i + " > model"));
				$("group.layer-" + i + " > model").attr("visible", "true");
			} else {
				this.classList.remove("active");
				//console.log("FALSE: group.layer-" + i + " > model)", document.querySelectorAll("group.layer-" + i + " > model"));
				$("group.layer-" + i + " > model").attr("visible", "false");
			}
		});
	}

	for(var i = 0; i < 20; i++) {

		c_layers[i] = {
			active: i == 0
		};

		var rect = $(document.createElementNS("http://www.w3.org/2000/svg", "rect"));
		rect[0].classList.add("layer");

		var secondOffset = !(i < 5 || (i >= 10 && i < 15));

		rect.data("layer", i);
		rect.attr("width", "10");
		rect.attr("height", "9");
		rect.attr("x", (i % 10) * 10 + 8 + secondOffset * 10);
		rect.attr("y", (i > 9) * 9 + 13);

		rect.hover(function() {
  			this.classList.add("over");
		}, function() {
			this.classList.remove("over");
		});

		rect.click(function(evt) {
			var chosen = +$(this).data("layer");
			if(evt.shiftKey) { // Toggle
			  c_layers[chosen].active = !c_layers[chosen].active;
			} else {  // Activate just one
				c_layers.forEach(function (e, i) {
					c_layers[i].active = i == chosen;
				});
			}
			updateLayers();
		});

		svg.append(rect);
	}
	updateLayers();


	$(".top-bar-section .right").append($("<li class='divider'></li><li><a class='renderStats' href=''#'></a></li>")) ;
	var renderStats = $(".renderStats");

	console.log(renderStats)

    if (window.Stats) {
    	var statsLocation = $("<li class='divider'></li><li class='stats'></li>");
		$(".top-bar-section .right").append(statsLocation) ;
	    var stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms
        //this.$el.hide();
        statsLocation.filter(".stats").append(stats.domElement);
        var loop = function () {
            stats.update();
            requestAnimationFrame(loop);
        };
        loop();
    };



	var xml3d = document.querySelector("xml3d");
	xml3d.addEventListener("framedrawn", function(e) {
		//console.log(e.detail.count)
		var count = e.detail.count;
		renderStats.text(version + " | Tris:" + count.primitives + " | Objects:" + count.objects);
	});
});
