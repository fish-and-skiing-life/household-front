// Sidebar Routers
export const menus = {
	'message.general': [
		{
			action: 'zmdi-view-dashboard',
			title: 'message.dashboard',
			active: false,
			label: 'New',
			path: '/dashboard',
			items: null 
		},
	],
	'message.otherLabel': [
		{
			action: 'ti-layout',
			title: 'message.board',
			active: false,
			items: null,
			path: '/statistics',
			label: 'Old'
		},
		{
			action: 'ti-user',
			title: 'message.map',
			active: false,
			items: null,
			path: '/user-info',
			label: 'Old'
		},
		{
			action: 'ti-user',
			title: 'message.groups',
			active: false,
			items: null,
			path: '/group',
			label: 'Old'
		}
	],

}
