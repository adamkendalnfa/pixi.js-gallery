const section = document.querySelector('section.coronawave')

//save the src for each image then replace all the html content inside the section
const originalImage = section.querySelector('img')
const originalImageSrc = originalImage.getAttribute('src')

section.innerHTML = ""


// set up pixi application, size based on the image size
const app  = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight, 
	transparent: true,

})

// add pixi appliacation to section tag
section.appendChild(app.view)

// make a new image
let image = null
let rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0])

// (curvature, lineWidth, lineContrast, verticalLine, noise, noiseSize, seed, vignetting, vignettingAlpha, vignettingBlur, time)
let crtFilter = new PIXI.filters.CRTFilter({
	curvature: 4,
	lineWidth : 3,
	noise: 0.15,
	vignetting: 0
})


// make a new loader (thing that loads things to the page)
const loader = new PIXI.loaders.Loader()

// load in our image
	loader.add('image', originalImageSrc)


	loader.load((loader, resources) => {

		// once the image has loaded, now do things
		// image = new PIXI.Sprite(resources.image.texture)
		image = new PIXI.TilingSprite(
			resources.image.texture,
			app.screen.width,
			app.screen.height
			)


		// add half the image height and width to account for the anchor being in the middle
		image.x =  window.innerWidth/2
		image.y = window.innerHeight/2

		image.interactive = true

		// Change anchor to middle of image, instead of top left
		image.anchor.x = 0.5
		image.anchor.y = 0.5

		image.tileScale.x = 1.7
		image.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.MIRRORED_REPEAT


		image.filters = [
			rgbFilter,
			crtFilter
		]

		// add image to the app
		app.stage.addChild(image)

		let mouseX = 0
		let centerX = 0

		let mouseY = 0
		let centerY = 0

		// listen to mouse movement
		section.addEventListener('mousemove', function(event){
			mouseX = event.pageX
			mouseY = event.pageY
			centerX = mouseX - (window.innerWidth/2)
			centerY = mouseY - (window.innerHeight/2)
		})


		// tween animation
		const animate = function (){

			image.tilePosition.y = image.tilePosition.y - 2

			// Split green on x axis mouse move
			rgbFilter.green = [Math.abs(centerX) * 0.3, centerY * 0.1]

			// Adjust CRT filter on y axis mouse move
			crtFilter.noise = Math.abs(centerY) * 0.002
			crtFilter.curvature = Math.abs(centerY * 0.01)
			crtFilter.lineWidth = Math.max(3, Math.abs(centerY * 0.04))



			// Animate the filter noise seed
			crtFilter.seed = Math.random();
			crtFilter.time += 0.5;


			// keep running this animation every frame
			requestAnimationFrame(animate)
		}

		// start animate loop
		animate()




	})