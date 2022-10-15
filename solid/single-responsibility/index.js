class CalorieTracker {
	constructor(maxCalories) {
		this.maxCalories = maxCalories;
		this.currentCalories = 0;
	}

	// Code for how to track calories
	trackCalories(calorieCount) {
		this.currentCalories += calorieCount;
		if (this.currentCalories > this.maxCalories) {
			this.informCalorieSurplus();
		}
	}

	// Code for notifying user when they exceed calories
	informCalorieSurplus() {
		console.log("Max calories exceeded");
	}
}
// The problem with above class is that it has two responsibilities
// Two reasons to change
// 1. If you want to change how to track calories
// 2. If you want to change how to inform user about calorieSurplus

const calorieTracker = new CalorieTracker(2000);
calorieTracker.trackCalories(500);
calorieTracker.trackCalories(1000);
calorieTracker.trackCalories(700);
