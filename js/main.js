//  *** FILTER 1: Bookwave filter - Displacement map animate + RGB split on mouse ***

// loop over each section, get image and replace with canvas
const sectionsDispRGB1 = document.querySelectorAll('section.dispRGB1')

sectionsDispRGB1.forEach(section => {


	//save the src for each image then replace all the html content inside the section
	const originalImage = section.querySelector('img')
	const originalImageSrc = originalImage.getAttribute('src')

	section.innerHTML = ""

	// set up pixi application, size based on the image size
	const app  = new PIXI.Application({
		width: 1100,
		height: 800, 
		transparent: true,

	})

	// add pixi appliacation to section tag
	section.appendChild(app.view)

	// make a new image
	let image = null
	let displacementImage = null
	let rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0])


	// make a new loader (thing that loads things to the page)
	const loader = new PIXI.loaders.Loader()


	// load in our image
	loader.add('image', originalImageSrc)
	loader.add('displacement', './assets/displacement1.jpg')
	loader.load((loader, resources) => {

		// once the image has loaded, now do things
		image = new PIXI.Sprite(resources.image.texture)
		displacementImage = new PIXI.Sprite(resources.displacement.texture)

		// add half the image height and width to account for the anchor being in the middle
		image.x = 100 + 450
		image.y = 100 + 300

		image.width = 900
		image.height = 600
		image.interactive = true

		// Change anchor to middle of image, instead of top left
		image.anchor.x = 0.5
		image.anchor.y = 0.5

		displacementImage.width = 600
		displacementImage.height = 600
		displacementImage.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
		

		image.filters = [
			new PIXI.filters.DisplacementFilter(displacementImage, 50),
			rgbFilter
		]

		// add image to the app
		app.stage.addChild(image)
		app.stage.addChild(displacementImage)


		// add motion to the displacement filter
		// app.ticker.add(() => {
		// 	displacementImage.x ++
		// 	displacementImage.y ++
		// } )

		let currentX = 0
		let aimX = 0

		let currentY = 0
		let aimY = 0

		// listen to mouse movement
		section.addEventListener('mousemove', function(event){
			// displacementImage.x = event.pageX
			// displacementImage.y = event.pageY
			aimX = event.pageX
			aimY = event.pageY
		})


		// tween animation
		const animate = function (){
			// currentX should get towards aimX every frame
			const diffX = aimX - currentX
			currentX = currentX + (diffX * 0.05)

			const diffY = aimY - currentY
			currentY = currentY + (diffY * 0.05)


			// if there is a displacement image loaded, move it
			if(displacementImage){
				displacementImage.x = currentX
				displacementImage.y = displacementImage.y + 1 + (diffY * 0.01)

				rgbFilter.red = [diffX * 0.1, 0]
				rgbFilter.green = [0, diffY * 0.1]
			}



			// keep running this animation every frame
			requestAnimationFrame(animate)
		}

		// start animate loop
		animate()


		// VARIATION - add rotation on each frame
		// app.ticker.add(() => {
		// 	image.rotation = image.rotation + 0.01
		// } )

	})
})


//  *** FILTER 2: Click Bulge/Pinch Filter ***


// Get mouse position relative to the canvas
let mouseX = 0
let mouseY = 0

const updatePosition = function(event){
	mouseX = event.data.global.x
	mouseY = event.data.global.y
}


const sectionsClickBulge = document.querySelectorAll('section.clickBulge')


sectionsClickBulge.forEach(section => {

	//save the src for each image then replace all the html content inside the section
	const originalImage = section.querySelector('img')
	const originalImageSrc = originalImage.getAttribute('src')

	section.innerHTML = ""

	// set up pixi application
	const app  = new PIXI.Application({
		width: 1100,
		height: 800, 
		transparent: true,

	})

	app.stage.interactive = true
	// app.stage.on('mousedown', updatePosition)

	// add pixi appliacation to section tag
	section.appendChild(app.view)

	// make a new image
	let image = null

	let bulgeFilter = new PIXI.filters.BulgePinchFilter([0.5, 0.5], 1, 1)

	// make a new loader (thing that loads things to the page)
	const loader = new PIXI.loaders.Loader()


	// load in our image
	loader.add('image', originalImageSrc)
	loader.load((loader, resources) => {
		console.log(resources)
		// once the image has loaded, now do things
		image = new PIXI.Sprite(resources.image.texture)

		image.on('mousedown', updatePosition)

		// add half the image height and width to account for the anchor being in the middle
		image.x = 100 + 450
		image.y = 100 + 300

		image.width = 900
		image.height = 600
		image.interactive = true

		// Change anchor to middle of image, instead of top left
		image.anchor.x = 0.5
		image.anchor.y = 0.5

		image.filters = [
			// rgbFilter,
			bulgeFilter
		]


		// add image to the app
		app.stage.addChild(image)

		

		// tween animation
		const animate = function (){
			bulgeFilter.uniforms.radius = bulgeFilter.uniforms.radius + 5
			if (bulgeFilter.uniforms.radius < 200) {

				// keep running this animation every frame
				requestAnimationFrame(animate)
			}
			else {
				bulgeFilter.uniforms.radius = 0
			}
			
		}


		// listen to mouse movement
		section.addEventListener('mousedown', function(event){
			let clickX = (mouseX - 100) / image.width
			let clickY = (mouseY - 25) / 800


			bulgeFilter.center = [clickX, clickY]
			// start animate loop
			animate()
		})

	})

})



//  *** FILTER 3: Linewave filter - Displacement filter mouse follow ***

// loop over each section, get image and replace with canvas
const sectionsLinewave= document.querySelectorAll('section.linewave')

sectionsLinewave.forEach(section => {


	//save the src for each image then replace all the html content inside the section
	const originalImage = section.querySelector('img')
	const originalImageSrc = originalImage.getAttribute('src')

	section.innerHTML = ""

	// set up pixi application, size based on the image size
	const app  = new PIXI.Application({
		width: 1100,
		height: 800, 
		transparent: true,

	})

	// add pixi appliacation to section tag
	section.appendChild(app.view)

	// make a new image
	let image = null
	let displacementImage = null


	// make a new loader (thing that loads things to the page)
	const loader = new PIXI.loaders.Loader()


	// load in our image
	loader.add('image', originalImageSrc)
	loader.add('displacement', './assets/displacement7.jpg')
	loader.load((loader, resources) => {

		// once the image has loaded, now do things
		image = new PIXI.Sprite(resources.image.texture)
		displacementImage = new PIXI.Sprite(resources.displacement.texture)

		// add half the image height and width to account for the anchor being in the middle
		image.x = 100 + 450
		image.y = 100 + 300

		image.width = 900
		image.height = 600
		image.interactive = true

		// Change anchor to middle of image, instead of top left
		image.anchor.x = 0.5
		image.anchor.y = 0.5

		displacementImage.width = 600
		displacementImage.height = 600

		// Change anchor to middle of image, instead of top left
		displacementImage.anchor.x = 0.7
		displacementImage.anchor.y = 0.5
		// displacementImage.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT

		image.filters = [
			new PIXI.filters.DisplacementFilter(displacementImage, 50),
		]

		// add image to the app
		app.stage.addChild(image)
		app.stage.addChild(displacementImage)


		// add motion to the displacement filter
		// app.ticker.add(() => {
		// 	displacementImage.x ++
		// 	displacementImage.y ++
		// } )

		let currentX = 0
		let aimX = 0

		let currentY = 0
		let aimY = 0

		// listen to mouse movement
		section.addEventListener('mousemove', function(event){
			// displacementImage.x = event.pageX
			// displacementImage.y = event.pageY
			aimX = event.pageX
			aimY = event.pageY
		})


		// tween animation
		const animate = function (){
			// currentX should get towards aimX every frame
			const diffX = aimX - currentX
			currentX = currentX + (diffX * 0.05)

			const diffY = aimY - currentY
			currentY = currentY + (diffY * 0.05)


			// if there is a displacement image loaded, move it
			if(displacementImage){
				displacementImage.x = currentX
				displacementImage.y = displacementImage.y + 1 + (diffY * 0.01)
			}



			// keep running this animation every frame
			requestAnimationFrame(animate)
		}

		// start animate loop
		animate()


		// VARIATION - add rotation on each frame
		// app.ticker.add(() => {
		// 	image.rotation = image.rotation + 0.01
		// } )

	})
})















