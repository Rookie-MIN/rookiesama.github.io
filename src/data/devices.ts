// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = {
	[categoryName: string]: Device[];
} & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	OnePlus: [
		{
			name: "iQOO Neo9S Pro",
			image: "https://www.bing.com/th/id/OIP.NF3Jd6DsUlA_n1rgByMRGAHaHa?w=170&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
			specs: "Gray / 12G + 512GB",
			description:
				"天玑 9300+ 当年独挡",
			link: "https://www.vivo.com.cn/vivo/iqooneo9spro/",
		},
	],
	Computer: [
		{
			name: "隐星P15",
			image: "https://www.colorful.com.cn/uploads/AttachFile/202305171636553782.jpg",
			specs: "i5-12500H / 32G / 512G + 2T / 8G RTX 4060",
			description:
				"夯",
			link: "https://www.colorful.com.cn/home/product?mid=158&id=33",
		},
	],
	Tablet: [
		{
			name: "Xiaomi Pad 7 Pro",
			image: "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-pad-7-pro/pc/5484effe86e2b64e1bf9d0235e7bd126.jpg?f=webp",
			specs: "12G + 256GB",
			description:
				"泡面盖子",
			link: "https://www.mi.com/hk/product/xiaomi-pad-7-pro/",
		},
	],
	Router: [
		{
			name: "GL-MT3000",
			image: "/images/device/mt3000.png",
			specs: "1000Mbps / 2.5G",
			description:
				"Portable WiFi 6 router suitable for business trips and home use.",
			link: "https://www.gl-inet.cn/products/gl-mt3000/",
		},
	],
};