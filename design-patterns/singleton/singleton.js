// Program to manage processes

// We can have one or more processes but we should have only one process manager

function Process() {
	this.state = state;
}

// const myVar = IIFE with constructor of object that you want to limit
const Singleton = (function () {
	// Put the Object constructor of the object you want to limit
	function ProcessManager() {
		this.nProcesses = 0;
	}

	// Store the reference of the instance to the Singleton Object
	let processManager;

	function createProcessManager() {
		processManager = new ProcessManager();
		return processManager;
	}

	function getProcessManager() {
		if (!processManager) {
			processManager = createProcessManager();
		}
		return processManager;
	}

	return {
		getProcessManager,
	};
})();

const pm1 = Singleton.getProcessManager();
const pm2 = Singleton.getProcessManager();
console.log("Are both instances equal?", pm1 == pm2);
