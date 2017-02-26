const Directions = {
	UP: "up",
	DOWN: "down",
};

let scrolling = false;

function createDOM(tag, attributes = {}, ...children) {
	let element = null;
	if (typeof tag === "string")
		element = document.createElement(tag);
	else
		element = document.createElementNS(tag.namespace, tag.tag);

	for (let key in attributes) {
		if (Array.isArray(attributes[key]))
			element.setAttribute(key, attributes[key].join(" "))
		else
			element.setAttribute(key, attributes[key]);
	}

	children.forEach(child => {
		if (typeof child === "string" || typeof child === "number" || typeof child === "boolean")
			child = document.createTextNode(child);

		element.appendChild(child);
	});

	return element;
}

// http://gizma.com/easing/#quad3
function easeInOutQuad(n,u,e,t){return n/=t/2,1>n?n*n*(e/2)+u:(--n,(n*(n-2)-1)*(-e/2)+u)}

function animateScrollTo(position, duration) {
	if (scrolling)
		return;

	let start = null;
	let scrollY = window.scrollY;
	function step(timestamp) {
		scrolling = true;
		if (!start)
			start = timestamp;

		let progress = timestamp - start;
		let top = easeInOutQuad(progress, scrollY, position - scrollY, duration);
		window.scroll(0, top);
		if (progress < duration)
			window.requestAnimationFrame(step);
		else {
			window.scroll(0, position);
			scrolling = false;
		}
	}
	step(performance.now());
}

function getPos(node, direction) {
	let topOfNode = node.getBoundingClientRect().top + document.body.scrollTop;
	if (direction === Directions.DOWN)
		return Math.floor(topOfNode);
	return Math.ceil(topOfNode);
}

function getNextParent(direction, parentComments) {
	let currentPos = direction === Directions.DOWN ? Math.ceil(window.scrollY) : Math.floor(window.scrollY);
	let targetIndex = 0;
	for (let i = 0; i < parentComments.length; ++i) {
		let parentPos = getPos(parentComments[i], direction);
		if (currentPos > parentPos || (direction === Directions.DOWN && currentPos === parentPos))
			continue;

		targetIndex = i;
		break;
	}

	if (direction === Directions.UP)
		return targetIndex > 0 ? parentComments[targetIndex - 1] : null;

	if (direction === Directions.DOWN)
		return targetIndex <= parentComments.length - 1 ? parentComments[targetIndex] : null;

	return null;
}

function goToNextParent(direction) {
	if (scrolling)
		return;

	let parentComments = Array.from(document.querySelectorAll(".sitetable.nestedlisting > .comment:not(.deleted)"));
	let targetComment = getNextParent(direction, parentComments);
	if (!targetComment)
		return;

	targetComment.querySelector(".entry").click();
	animateScrollTo(getPos(targetComment), 800);
}

let container = document.body.appendChild(createDOM(
	"div",
	{
		class: "redditnav",
	}
));

let firstButtonContainer = container.appendChild(document.createElement("div"));

let firstButton = firstButtonContainer.appendChild(createDOM(
	"a",
	null,
	createDOM(
		{
			tag: "svg",
			namespace: "http://www.w3.org/2000/svg",
		},
		{
			xmlns: "http://www.w3.org/2000/svg",
			version: "1.1",
			viewBox: "0 0 15 15",
		},
		createDOM(
			{
				tag: "g",
				namespace: "http://www.w3.org/2000/svg",
			},
			{
				transform: "translate(7.500000, 7.500000) scale(1, -1) translate(-7.500000, -7.500000)",
			},
			createDOM(
				{
					tag: "path",
					namespace: "http://www.w3.org/2000/svg",
				},
				{
					d: "M2.41714286,14.9764286 C2.68071429,14.9485714 2.98714286,14.8457143 3.22071429,14.7085714 C3.34714286,14.6335714 3.46714286,14.5328571 3.64928571,14.3507143 L3.9,14.1 L4.11642857,14.2092857 C5.52214286,14.9121429 7.14857143,15.15 8.80714286,14.8907143 C9.88071429,14.7235714 10.9414286,14.2821429 11.8392857,13.6307143 C12.3342857,13.2707143 12.9128571,12.7307143 13.2985714,12.2657143 C14.2435714,11.13 14.7642857,9.915 14.9507143,8.42142857 C15.0021429,7.99714286 15.0021429,6.975 14.9507143,6.55714286 C14.7342857,4.84071429 14.0271429,3.41357143 12.7714286,2.16642857 C11.6142857,1.01571429 10.2257143,0.310714286 8.67857143,0.0878571429 C7.76142857,-0.045 6.825,-0.0235714286 5.93571429,0.154285714 C4.53428571,0.430714286 3.28071429,1.11214286 2.22857143,2.16428571 C0.942857143,3.45 0.244285714,4.87714286 0.0428571429,6.62142857 C-0.0192857143,7.17214286 -0.00642857143,8.02928571 0.0771428571,8.59285714 C0.192857143,9.38571429 0.473571429,10.275 0.837857143,10.9971429 L0.9,11.1192857 L0.84,11.1642857 C0.604285714,11.3464286 0.338571429,11.6635714 0.220714286,11.9035714 C0.00214285714,12.3407143 -0.0578571429,12.9192857 0.0642857143,13.3821429 C0.278571429,14.1964286 1.01142857,14.8564286 1.83857143,14.9764286 C2.01642857,15.0021429 2.18142857,15.0021429 2.41714286,14.9764286 L2.41714286,14.9764286 Z",
					fill: "white",
				}
			),
			createDOM(
				{
					tag: "path",
					namespace: "http://www.w3.org/2000/svg",
				},
				{
					d: "M1.87071429,13.8964286 C1.68214286,13.8557143 1.5,13.7507143 1.36071429,13.605 C0.972857143,13.2 0.979285714,12.51 1.37357143,12.1135714 C1.43571429,12.0514286 1.49142857,12 1.49785714,12 C1.50642857,12 1.59428571,12.1028571 1.69285714,12.2314286 C1.92857143,12.5292857 2.45357143,13.0542857 2.76,13.2942857 C2.89071429,13.3992857 3,13.4914286 3,13.5 C3,13.5085714 2.94214286,13.5707143 2.87142857,13.6371429 C2.60785714,13.8878571 2.25428571,13.98 1.87071429,13.8964286 L1.87071429,13.8964286 Z",
					fill: "currentColor",
				}
			),
			createDOM(
				{
					tag: "path",
					namespace: "http://www.w3.org/2000/svg",
				},
				{
					d: "M6.975,13.905 C5.66571429,13.8128571 4.47857143,13.3435714 3.46071429,12.5164286 C3.21,12.3128571 2.745,11.8521429 2.53071429,11.5928571 C1.99928571,10.9521429 1.62428571,10.2814286 1.38428571,9.53785714 C1.00071429,8.35071429 0.975,6.87214286 1.31571429,5.68285714 C1.61142857,4.65857143 2.10857143,3.81428571 2.89285714,3.01285714 C3.64285714,2.24571429 4.425,1.74 5.36357143,1.41642857 C6.495,1.02642857 7.85357143,0.964285714 9.04285714,1.245 C9.93214286,1.455 10.7657143,1.86 11.4857143,2.43428571 C11.8842857,2.75142857 12.51,3.42 12.8185714,3.85714286 C13.7378571,5.16214286 14.1064286,6.85928571 13.8428571,8.57357143 C13.6328571,9.93428571 13.0264286,11.0892857 11.9871429,12.1092857 C11.4535714,12.63 10.9757143,12.9728571 10.3392857,13.2878571 C9.32357143,13.7892857 8.21785714,13.9907143 6.975,13.905 L6.975,13.905 Z",
					fill: "currentColor",
				}
			),
			createDOM(
				{
					tag: "path",
					namespace: "http://www.w3.org/2000/svg",
				},
				{
					d: "M10.395,11.025 C9.45428571,8.79214286 8.78357143,7.38642857 8.39571429,6.82285714 C8.28642857,6.66214286 7.82142857,6.19071429 7.43357143,5.84571429 C6.57857143,5.08285714 4.32642857,3.21428571 4.31142857,3.255 C4.305,3.27428571 4.88357143,4.66714286 5.19642857,5.37642857 C5.97214286,7.14857143 6.41357143,7.995 6.74785714,8.36142857 C7.02642857,8.66571429 8.29928571,9.77785714 9.56785714,10.8235714 C9.86357143,11.0678571 10.2342857,11.3764286 10.3928571,11.5135714 C10.5514286,11.6485714 10.6842857,11.7514286 10.6885714,11.745 C10.6907143,11.7364286 10.56,11.4128571 10.395,11.025 L10.395,11.025 Z",
					fill: "white",
				}
			)
		)
	),
	createDOM(
		{
			tag: "svg",
			namespace: "http://www.w3.org/2000/svg",
		},
		{
			xmlns: "http://www.w3.org/2000/svg",
			version: "1.1",
			viewBox: "0 0 7 3",
		},
		createDOM(
			{
				tag: "path",
				namespace: "http://www.w3.org/2000/svg",
			},
			{
				d: "M 0.5 0.5 L 3.5 3.5 L 6.5 0.5",
				fill: "none",
				stroke: "white",
			}
		)
	)
));
firstButton.dataset.label = "Next Thread (W)";
firstButton.addEventListener("click", event => goToNextParent(Directions.DOWN));

let secondButtonContainer = container.appendChild(document.createElement("div"));

let secondButton = secondButtonContainer.appendChild(createDOM(
	"a",
	null,
	createDOM(
		{
			tag: "svg",
			namespace: "http://www.w3.org/2000/svg",
		},
		{
			xmlns: "http://www.w3.org/2000/svg",
			version: "1.1",
			viewBox: "0 0 7 3",
		},
		createDOM(
				{
					tag: "path",
					namespace: "http://www.w3.org/2000/svg",
				},
			{
				d: "M 0.5 3.5 L 3.5 0.5 L 6.5 3.5",
				fill: "none",
				stroke: "white",
			}
		)
	)
));
secondButton.dataset.label = "Previous Thread (Q)";
secondButton.addEventListener("click", event => goToNextParent(Directions.UP));

document.addEventListener("keydown", event => {
	if (event.target.value)
		return;

	switch (event.keyCode) {
	case 81: // Q
		goToNextParent(Directions.UP);
		break;

	case 87: // W
		goToNextParent(Directions.DOWN);
		break;

	default:
		return;
	}
});
