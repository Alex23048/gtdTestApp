//startup data
var backendData = [
	{
		id: 1,
		name: "login page",
		type: "task",
		status: "todo"
	},
	{
		id: 4,
		name: "main page",
		type: "task",
		status: "todo"
	},
	{
		id: 8,
		name: "js error on settings page",
		type: "bug",
		status: "inProgress"
	},
	{
		id: 9,
		name: "install package",
		type: "task",
		status: "done"
	},
];

var backendData2 = backendData.slice(0);

//to restore original data from console
function restoreData()
{
	backendData = backendData2.slice(0);
	saveToLS();
}