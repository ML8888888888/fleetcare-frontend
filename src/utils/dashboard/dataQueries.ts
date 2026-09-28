export type DashboardDetail = {
	label: string
	type?: 'secondary' | 'success' | 'warning' | 'danger'
}

export const dashboardKpis = [
	{
		title: 'FLEET OVERVIEW',
		value: '4,256',
		details: [
			{ label: '3,987 Active', type: 'success' as const },
			{ label: '269 In maintenance', type: 'warning' as const },
		],
	},
	{
		title: 'AT RISK (CLASS 3-4)',
		value: '186',
		details: [
			{ label: '112 High', type: 'warning' as const },
			{ label: '74 Critical', type: 'danger' as const },
		],
	},
	{
		title: 'MAINTENANCE THIS WEEK',
		value: '37',
		details: [
			{ label: '28 Completed', type: 'success' as const },
			{ label: '9 Pending', type: 'warning' as const },
		],
	},
	{
		title: 'AVG. RISK SCORE',
		value: '32 /100',
		details: [
			{ label: '↓ 5', type: 'success' as const },
			{ label: 'Fleet average - last 7 days', type: 'secondary' as const },
		],
	},
] satisfies Array<{ title: string; value: string; details: DashboardDetail[] }>

export const riskClasses = [
	{ label: 'Continue', count: 2479, percentage: '58.2%', color: '#e6f4ff' },
	{ label: 'Monitor', count: 536, percentage: '12.6%', color: '#1677ff' },
	{ label: 'Enhanced Monitor', count: 374, percentage: '8.8%', color: '#d4b106' },
	{ label: 'Inspect', count: 472, percentage: '11.1%', color: '#d46b08' },
	{ label: 'Priority Inspect', count: 395, percentage: '9.3%', color: '#cf1322' },
]

export const riskAlerts = [
	{ vehicle: 'VHC-89321', description: 'Component X · 0-6 steps', className: 'Class 4', tagColor: 'red', risk: '92%' },
	{ vehicle: 'VHC-55217', description: 'Component X · 0-6 steps', className: 'Class 4', tagColor: 'red', risk: '88%' },
	{ vehicle: 'VHC-66107', description: 'Component X · 6-12 steps', className: 'Class 3', tagColor: 'orange', risk: '71%' },
]

export const maintenancePlan = [
	{ title: 'Immediate (0-6 steps)', value: '74', color: '#cf1322' },
	{ title: 'Short term (6-24 steps)', value: '151' },
	{ title: 'Monitor (24+ steps)', value: '1,856' },
	{ title: 'Financial comparison', kind: 'financial' as const },
]
