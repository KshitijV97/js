import logMessage from "./logger";

class CalorieTracker {
	constructor(maxCalories) {
		this.maxCalories = maxCalories;
		this.currentCalories = 0;
	}

	// Code for how to track calories
	trackCalories(calorieCount) {
		this.currentCalories += calorieCount;
		if (this.currentCalories > this.maxCalories) {
			// Now the work of notifying user has been exported elsewhere
			logMessage("Max calories exceeded");
		}
	}
}

const calorieTracker = new CalorieTracker(2000);
calorieTracker.trackCalories(500);
calorieTracker.trackCalories(1000);
calorieTracker.trackCalories(700);
