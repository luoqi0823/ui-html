const screenRoot = document.getElementById("screen-root");
const modalMask = document.getElementById("modal-mask");
const drawerMask = document.getElementById("drawer-mask");
const projectMask = document.getElementById("project-mask");
const breadcrumbParent = document.getElementById("breadcrumb-parent");
const breadcrumbPage = document.getElementById("breadcrumb-page");
const projectSearchInput = document.getElementById("project-search-input");
const projectOptionList = document.getElementById("project-option-list");
const projectConfirmBtn = document.getElementById("project-confirm-btn");

const state = {
  activePage: "invoice",
  currentProjectId: "project-a",
  pendingProjectId: "project-a",
  activeSupplierId: "supplier-1",
  tabs: {
    invoice: "invoice",
    stock: "inbound",
  },
  pagination: {},
};

let activeTables = {};
let overlayTables = {};
let modalTables = {};
let drawerTables = {};
let activeCharts = [];

const financeProjects = [
  {
    id: "project-a",
    code: "SCDL-2026-018",
    name: "城市交通数据中台建设一期",
    customer: "成都数智交通集团",
    accountManager: "刘敏",
    projectManager: "周舟",
    contractName: "城市交通数据中台建设一期",
    contractAmount: "¥ 8,620,000",
    contractSignDate: "2026-01-08",
    paymentTerms: [
      { text: "合同预付款 30% ¥ 2,586,000", done: true },
      { text: "里程碑验收 35% ¥ 3,017,000", done: true },
      { text: "终验通过 20% ¥ 1,724,000", done: false },
      { text: "质保尾款 15% ¥ 1,293,000", done: false },
    ],
    invoiceStats: {
      collectable: "¥ 5,603,000",
      invoiced: "¥ 4,660,000",
      available: "¥ 943,000",
      collected: "¥ 3,540,000",
      uncollected: "¥ 1,120,000",
    },
    invoiceRecords: [
      {
        id: "KP-202604-001",
        code: "KP-202604-001",
        taxNo: "91510100MA6C9X4R3A",
        date: "2026-04-03",
        amount: "¥ 860,000",
        tax: "¥ 51,600",
        type: "增值税专用发票",
        typeTone: "blue",
        content: "系统集成服务费",
        remark: "阶段验收节点开票，发票附件已归档",
      },
      {
        id: "KP-202603-006",
        code: "KP-202603-006",
        taxNo: "91510100MA6C9X4R3A",
        date: "2026-03-25",
        amount: "¥ 1,260,000",
        tax: "¥ 75,600",
        type: "增值税专用发票",
        typeTone: "blue",
        content: "软件开发费",
        remark: "对应里程碑验收 1 批次",
      },
      {
        id: "KP-202603-003",
        code: "KP-202603-003",
        taxNo: "91510100MA6C9X4R3A",
        date: "2026-03-10",
        amount: "¥ 720,000",
        tax: "¥ 43,200",
        type: "增值税专用发票",
        typeTone: "blue",
        content: "技术服务费",
        remark: "实施顾问驻场服务",
      },
      {
        id: "KP-202602-007",
        code: "KP-202602-007",
        taxNo: "91510100MA6C9X4R3A",
        date: "2026-02-27",
        amount: "¥ 540,000",
        tax: "¥ 0",
        type: "增值税普通发票",
        typeTone: "gold",
        content: "运维服务费",
        remark: "运维支撑阶段性开票",
      },
      {
        id: "KP-202602-002",
        code: "KP-202602-002",
        taxNo: "91510100MA6C9X4R3A",
        date: "2026-02-14",
        amount: "¥ 780,000",
        tax: "¥ 46,800",
        type: "增值税专用发票",
        typeTone: "blue",
        content: "咨询服务费",
        remark: "项目启动与方案确认阶段",
      },
      {
        id: "KP-202601-001",
        code: "KP-202601-001",
        taxNo: "91510100MA6C9X4R3A",
        date: "2026-01-16",
        amount: "¥ 500,000",
        tax: "¥ 0",
        type: "增值税普通发票",
        typeTone: "gold",
        content: "其他",
        remark: "首期咨询与需求调研补充开票",
      },
    ],
    collectionRecords: [
      {
        id: "HK-202604-002",
        code: "HK-202604-002",
        date: "2026-04-05",
        amount: "¥ 420,000",
        method: "银行转账",
        account: "工行成都高新支行 6222 **** 1288",
        remark: "客户回款凭证已上传",
      },
      {
        id: "HK-202603-006",
        code: "HK-202603-006",
        date: "2026-03-28",
        amount: "¥ 1,120,000",
        method: "银行转账",
        account: "工行成都高新支行 6222 **** 1288",
        remark: "对应里程碑验收回款",
      },
      {
        id: "HK-202603-003",
        code: "HK-202603-003",
        date: "2026-03-11",
        amount: "¥ 680,000",
        method: "承兑",
        account: "建行软件园支行 6217 **** 9821",
        remark: "承兑票据待核销",
      },
      {
        id: "HK-202602-008",
        code: "HK-202602-008",
        date: "2026-02-26",
        amount: "¥ 520,000",
        method: "银行转账",
        account: "工行成都高新支行 6222 **** 1288",
        remark: "运维服务对应回款",
      },
      {
        id: "HK-202602-001",
        code: "HK-202602-001",
        date: "2026-02-06",
        amount: "¥ 400,000",
        method: "现金",
        account: "线下收款",
        remark: "历史补录回款",
      },
      {
        id: "HK-202601-001",
        code: "HK-202601-001",
        date: "2026-01-18",
        amount: "¥ 400,000",
        method: "银行转账",
        account: "工行成都高新支行 6222 **** 1288",
        remark: "项目启动首款",
      },
    ],
    revenueTerms: [
      { text: "需求确认 20% ¥ 1,724,000", done: true },
      { text: "阶段验收通过 35% ¥ 3,017,000", done: true },
      { text: "终验通过 25% ¥ 2,155,000", done: false },
      { text: "质保期结束 20% ¥ 1,724,000", done: false },
    ],
    revenueStats: {
      contract: "¥ 8,620,000",
      confirmed: "¥ 4,741,000",
      ratio: "55.0%",
      pending: "¥ 3,879,000",
    },
    revenueRecords: [
      {
        id: "SRQR-202604-001",
        node: "阶段验收通过",
        ratio: "35%",
        amount: "¥ 3,017,000",
        date: "2026-04-03",
        acceptance: "是",
        acceptanceTone: "green",
        remark: "验收单与测试报告齐备",
      },
      {
        id: "SRQR-202602-001",
        node: "需求确认",
        ratio: "20%",
        amount: "¥ 1,724,000",
        date: "2026-02-18",
        acceptance: "是",
        acceptanceTone: "green",
        remark: "需求确认书已归档",
      },
      {
        id: "SRQR-202605-001",
        node: "终验通过",
        ratio: "25%",
        amount: "¥ 2,155,000",
        date: "2026-05-20",
        acceptance: "否",
        acceptanceTone: "gold",
        remark: "审批单待发起，本条用于分页预览",
      },
      {
        id: "SRQR-202605-002",
        node: "终验补充确认",
        ratio: "5%",
        amount: "¥ 431,000",
        date: "2026-05-30",
        acceptance: "否",
        acceptanceTone: "gold",
        remark: "合同补充条款模拟数据",
      },
      {
        id: "SRQR-202606-001",
        node: "质保尾款预确认",
        ratio: "10%",
        amount: "¥ 862,000",
        date: "2026-06-18",
        acceptance: "否",
        acceptanceTone: "red",
        remark: "仅用于展示分页与详情入口",
      },
      {
        id: "SRQR-202606-002",
        node: "质保期结束",
        ratio: "20%",
        amount: "¥ 1,724,000",
        date: "2026-06-30",
        acceptance: "否",
        acceptanceTone: "red",
        remark: "预计节点，尚未审批通过",
      },
    ],
    costStats: {
      total: "¥ 4,180,000",
      ratio: "48.5%",
      supplier: "¥ 2,340,000",
      labor: "¥ 1,380,000",
      expense: "¥ 460,000",
    },
    supplierCosts: [
      {
        id: "CGHT-202604-001",
        contractCode: "CGHT-202604-001",
        projectName: "城市交通数据中台建设一期",
        supplier: "成都天擎科技有限公司",
        contractAmount: "¥ 1,260,000",
        ticketAmount: "¥ 1,108,000",
        paidAmount: "¥ 860,000",
        unpaidAmount: "¥ 248,000",
        unticketedAmount: "¥ 152,000",
        status: "部分支付",
        statusTone: "purple",
      },
      {
        id: "CGHT-202603-006",
        contractCode: "CGHT-202603-006",
        projectName: "城市交通数据中台建设一期",
        supplier: "云图集成服务有限公司",
        contractAmount: "¥ 740,000",
        ticketAmount: "¥ 712,400",
        paidAmount: "¥ 712,400",
        unpaidAmount: "¥ 0",
        unticketedAmount: "¥ 27,600",
        status: "已支付",
        statusTone: "green",
      },
      {
        id: "CGHT-202603-002",
        contractCode: "CGHT-202603-002",
        projectName: "城市交通数据中台建设一期",
        supplier: "川维设备服务有限公司",
        contractAmount: "¥ 520,000",
        ticketAmount: "¥ 520,000",
        paidAmount: "¥ 260,000",
        unpaidAmount: "¥ 260,000",
        unticketedAmount: "¥ 0",
        status: "待支付",
        statusTone: "red",
      },
      {
        id: "CGHT-202603-008",
        contractCode: "CGHT-202603-008",
        projectName: "城市交通数据中台建设一期",
        supplier: "星联网络科技有限公司",
        contractAmount: "¥ 360,000",
        ticketAmount: "¥ 0",
        paidAmount: "¥ 0",
        unpaidAmount: "¥ 360,000",
        unticketedAmount: "¥ 360,000",
        status: "待支付",
        statusTone: "red",
      },
      {
        id: "CGHT-202602-004",
        contractCode: "CGHT-202602-004",
        projectName: "城市交通数据中台建设一期",
        supplier: "成都智维服务有限公司",
        contractAmount: "¥ 410,000",
        ticketAmount: "¥ 387,000",
        paidAmount: "¥ 387,000",
        unpaidAmount: "¥ 0",
        unticketedAmount: "¥ 23,000",
        status: "已支付",
        statusTone: "green",
      },
      {
        id: "CGHT-202602-001",
        contractCode: "CGHT-202602-001",
        projectName: "城市交通数据中台建设一期",
        supplier: "西南运维协作中心",
        contractAmount: "¥ 290,000",
        ticketAmount: "¥ 180,000",
        paidAmount: "¥ 80,000",
        unpaidAmount: "¥ 100,000",
        unticketedAmount: "¥ 110,000",
        status: "部分支付",
        statusTone: "purple",
      },
    ],
    expenseBars: [
      { label: "差旅费", amount: "¥ 182,000", percent: "39.6%", width: "39.6%", tone: "" },
      { label: "业务招待费", amount: "¥ 116,000", percent: "25.2%", width: "25.2%", tone: "green" },
      { label: "办公费", amount: "¥ 64,000", percent: "13.9%", width: "13.9%", tone: "gold" },
      { label: "交通费", amount: "¥ 58,000", percent: "12.6%", width: "12.6%", tone: "purple" },
      { label: "其他", amount: "¥ 40,000", percent: "8.7%", width: "8.7%", tone: "red" },
    ],
    expenseSummary: [
      {
        id: "张晨",
        user: "张晨",
        dept: "交付实施部",
        expenseAmount: "¥ 84,600",
        costAmount: "¥ 78,540",
        expenseCount: "5",
        advanceCount: "1",
      },
      {
        id: "李岚",
        user: "李岚",
        dept: "研发中心",
        expenseAmount: "¥ 62,300",
        costAmount: "¥ 58,100",
        expenseCount: "4",
        advanceCount: "0",
      },
      {
        id: "王晟",
        user: "王晟",
        dept: "交付实施部",
        expenseAmount: "¥ 49,800",
        costAmount: "¥ 45,920",
        expenseCount: "3",
        advanceCount: "1",
      },
      {
        id: "陈果",
        user: "陈果",
        dept: "测试质量部",
        expenseAmount: "¥ 38,200",
        costAmount: "¥ 35,900",
        expenseCount: "3",
        advanceCount: "0",
      },
      {
        id: "刘畅",
        user: "刘畅",
        dept: "研发中心",
        expenseAmount: "¥ 34,900",
        costAmount: "¥ 32,600",
        expenseCount: "2",
        advanceCount: "1",
      },
      {
        id: "赵禾",
        user: "赵禾",
        dept: "产品中心",
        expenseAmount: "¥ 29,100",
        costAmount: "¥ 27,300",
        expenseCount: "2",
        advanceCount: "0",
      },
    ],
    laborTrend: [
      { month: "2026-01", amount: "¥ 252,000", hours: "468h", headcount: "12人" },
      { month: "2026-02", amount: "¥ 286,000", hours: "512h", headcount: "13人" },
      { month: "2026-03", amount: "¥ 318,000", hours: "560h", headcount: "15人" },
      { month: "2026-04", amount: "¥ 524,000", hours: "812h", headcount: "18人" },
    ],
    laborRows: [
      {
        id: "ZHANGCHEN-202604",
        name: "张晨",
        dept: "交付实施部",
        role: "项目经理",
        month: "2026-04",
        projectHours: "164h",
        unitCost: "¥ 356/h",
        laborCost: "¥ 58,384",
      },
      {
        id: "LILAN-202604",
        name: "李岚",
        dept: "研发中心",
        role: "前端工程师",
        month: "2026-04",
        projectHours: "152h",
        unitCost: "¥ 307/h",
        laborCost: "¥ 46,664",
      },
      {
        id: "WANGSHENG-202604",
        name: "王晟",
        dept: "交付实施部",
        role: "实施顾问",
        month: "2026-04",
        projectHours: "176h",
        unitCost: "¥ 234/h",
        laborCost: "¥ 41,184",
      },
      {
        id: "CHENGUO-202604",
        name: "陈果",
        dept: "测试质量部",
        role: "测试工程师",
        month: "2026-04",
        projectHours: "148h",
        unitCost: "¥ 214/h",
        laborCost: "¥ 31,672",
      },
      {
        id: "LIUCHANG-202604",
        name: "刘畅",
        dept: "研发中心",
        role: "后端工程师",
        month: "2026-04",
        projectHours: "160h",
        unitCost: "¥ 311/h",
        laborCost: "¥ 49,760",
      },
      {
        id: "ZHAOHE-202604",
        name: "赵禾",
        dept: "产品中心",
        role: "产品经理",
        month: "2026-04",
        projectHours: "142h",
        unitCost: "¥ 255/h",
        laborCost: "¥ 36,210",
      },
    ],
  },
  {
    id: "project-b",
    code: "GZDL-2026-006",
    name: "智慧工地综合监管平台二期",
    customer: "贵州交投建设集团",
    accountManager: "黄楠",
    projectManager: "陈澈",
    contractName: "智慧工地综合监管平台二期",
    contractAmount: "¥ 6,480,000",
    contractSignDate: "2026-01-20",
    paymentTerms: [
      { text: "预付款 40% ¥ 2,592,000", done: true },
      { text: "阶段验收 30% ¥ 1,944,000", done: true },
      { text: "终验通过 20% ¥ 1,296,000", done: false },
      { text: "尾款 10% ¥ 648,000", done: false },
    ],
    invoiceStats: {
      collectable: "¥ 4,536,000",
      invoiced: "¥ 3,180,000",
      available: "¥ 1,356,000",
      collected: "¥ 2,420,000",
      uncollected: "¥ 760,000",
    },
    invoiceRecords: [
      {
        id: "KP-202604-101",
        code: "KP-202604-101",
        taxNo: "91520100MA6P5L7K9M",
        date: "2026-04-06",
        amount: "¥ 680,000",
        tax: "¥ 40,800",
        type: "增值税专用发票",
        typeTone: "blue",
        content: "运维服务费",
        remark: "运维服务补充开票",
      },
      {
        id: "KP-202603-104",
        code: "KP-202603-104",
        taxNo: "91520100MA6P5L7K9M",
        date: "2026-03-26",
        amount: "¥ 920,000",
        tax: "¥ 55,200",
        type: "增值税专用发票",
        typeTone: "blue",
        content: "系统集成服务费",
        remark: "监管平台设备集成开票",
      },
      {
        id: "KP-202603-108",
        code: "KP-202603-108",
        taxNo: "91520100MA6P5L7K9M",
        date: "2026-03-10",
        amount: "¥ 540,000",
        tax: "¥ 0",
        type: "增值税普通发票",
        typeTone: "gold",
        content: "技术服务费",
        remark: "实施节点二提交审批",
      },
      {
        id: "KP-202602-101",
        code: "KP-202602-101",
        taxNo: "91520100MA6P5L7K9M",
        date: "2026-02-27",
        amount: "¥ 460,000",
        tax: "¥ 27,600",
        type: "增值税专用发票",
        typeTone: "blue",
        content: "软件开发费",
        remark: "需求分析与开发排期阶段",
      },
      {
        id: "KP-202602-099",
        code: "KP-202602-099",
        taxNo: "91520100MA6P5L7K9M",
        date: "2026-02-14",
        amount: "¥ 320,000",
        tax: "¥ 0",
        type: "增值税普通发票",
        typeTone: "gold",
        content: "咨询服务费",
        remark: "阶段驻场服务补充开票",
      },
      {
        id: "KP-202601-088",
        code: "KP-202601-088",
        taxNo: "91520100MA6P5L7K9M",
        date: "2026-01-30",
        amount: "¥ 260,000",
        tax: "¥ 15,600",
        type: "增值税专用发票",
        typeTone: "blue",
        content: "其他",
        remark: "启动阶段临时补充单据",
      },
    ],
    collectionRecords: [
      {
        id: "HK-202604-101",
        code: "HK-202604-101",
        date: "2026-04-08",
        amount: "¥ 420,000",
        method: "银行转账",
        account: "交行贵阳分行 6228 **** 3801",
        remark: "验收节点回款到账",
      },
      {
        id: "HK-202603-106",
        code: "HK-202603-106",
        date: "2026-03-29",
        amount: "¥ 780,000",
        method: "银行转账",
        account: "交行贵阳分行 6228 **** 3801",
        remark: "里程碑二回款",
      },
      {
        id: "HK-202603-102",
        code: "HK-202603-102",
        date: "2026-03-02",
        amount: "¥ 360,000",
        method: "其他",
        account: "银企直连补录",
        remark: "历史补录数据",
      },
      {
        id: "HK-202602-102",
        code: "HK-202602-102",
        date: "2026-02-18",
        amount: "¥ 460,000",
        method: "银行转账",
        account: "交行贵阳分行 6228 **** 3801",
        remark: "合同预付款到款",
      },
      {
        id: "HK-202602-099",
        code: "HK-202602-099",
        date: "2026-02-02",
        amount: "¥ 240,000",
        method: "现金",
        account: "线下收款",
        remark: "历史补录凭证待完善",
      },
      {
        id: "HK-202601-096",
        code: "HK-202601-096",
        date: "2026-01-15",
        amount: "¥ 160,000",
        method: "银行转账",
        account: "交行贵阳分行 6228 **** 3801",
        remark: "项目启动款",
      },
    ],
    revenueTerms: [
      { text: "需求确认 25% ¥ 1,620,000", done: true },
      { text: "阶段验收 35% ¥ 2,268,000", done: false },
      { text: "终验通过 25% ¥ 1,620,000", done: false },
      { text: "尾款 15% ¥ 972,000", done: false },
    ],
    revenueStats: {
      contract: "¥ 6,480,000",
      confirmed: "¥ 1,620,000",
      ratio: "25.0%",
      pending: "¥ 4,860,000",
    },
    revenueRecords: [
      {
        id: "SRQR-202602-101",
        node: "需求确认",
        ratio: "25%",
        amount: "¥ 1,620,000",
        date: "2026-02-19",
        acceptance: "是",
        acceptanceTone: "green",
        remark: "需求确认书已归档",
      },
      {
        id: "SRQR-202604-101",
        node: "阶段验收",
        ratio: "35%",
        amount: "¥ 2,268,000",
        date: "2026-04-16",
        acceptance: "否",
        acceptanceTone: "gold",
        remark: "待补充验收附件",
      },
      {
        id: "SRQR-202605-101",
        node: "终验通过",
        ratio: "25%",
        amount: "¥ 1,620,000",
        date: "2026-05-28",
        acceptance: "否",
        acceptanceTone: "red",
        remark: "预计节点",
      },
      {
        id: "SRQR-202606-101",
        node: "尾款",
        ratio: "15%",
        amount: "¥ 972,000",
        date: "2026-06-30",
        acceptance: "否",
        acceptanceTone: "red",
        remark: "尾款确认",
      },
      {
        id: "SRQR-202607-101",
        node: "补充确认 A",
        ratio: "5%",
        amount: "¥ 324,000",
        date: "2026-07-10",
        acceptance: "否",
        acceptanceTone: "gold",
        remark: "模拟数据",
      },
      {
        id: "SRQR-202607-102",
        node: "补充确认 B",
        ratio: "5%",
        amount: "¥ 324,000",
        date: "2026-07-20",
        acceptance: "否",
        acceptanceTone: "gold",
        remark: "模拟数据",
      },
    ],
    costStats: {
      total: "¥ 3,260,000",
      ratio: "50.3%",
      supplier: "¥ 1,920,000",
      labor: "¥ 980,000",
      expense: "¥ 360,000",
    },
    supplierCosts: [
      {
        id: "CGHT-202604-101",
        contractCode: "CGHT-202604-101",
        projectName: "智慧工地综合监管平台二期",
        supplier: "贵安天行科技有限公司",
        contractAmount: "¥ 980,000",
        ticketAmount: "¥ 910,800",
        paidAmount: "¥ 620,000",
        unpaidAmount: "¥ 290,800",
        unticketedAmount: "¥ 69,200",
        status: "部分支付",
        statusTone: "purple",
      },
      {
        id: "CGHT-202603-102",
        contractCode: "CGHT-202603-102",
        projectName: "智慧工地综合监管平台二期",
        supplier: "贵黔智联设备有限公司",
        contractAmount: "¥ 520,000",
        ticketAmount: "¥ 520,000",
        paidAmount: "¥ 520,000",
        unpaidAmount: "¥ 0",
        unticketedAmount: "¥ 0",
        status: "已支付",
        statusTone: "green",
      },
      {
        id: "CGHT-202603-108",
        contractCode: "CGHT-202603-108",
        projectName: "智慧工地综合监管平台二期",
        supplier: "中黔信息服务有限公司",
        contractAmount: "¥ 330,000",
        ticketAmount: "¥ 311,300",
        paidAmount: "¥ 200,000",
        unpaidAmount: "¥ 111,300",
        unticketedAmount: "¥ 18,700",
        status: "待支付",
        statusTone: "red",
      },
      {
        id: "CGHT-202602-108",
        contractCode: "CGHT-202602-108",
        projectName: "智慧工地综合监管平台二期",
        supplier: "川南设备服务有限公司",
        contractAmount: "¥ 280,000",
        ticketAmount: "¥ 0",
        paidAmount: "¥ 0",
        unpaidAmount: "¥ 280,000",
        unticketedAmount: "¥ 280,000",
        status: "待支付",
        statusTone: "red",
      },
      {
        id: "CGHT-202602-099",
        contractCode: "CGHT-202602-099",
        projectName: "智慧工地综合监管平台二期",
        supplier: "云图网络科技有限公司",
        contractAmount: "¥ 740,000",
        ticketAmount: "¥ 712,400",
        paidAmount: "¥ 712,400",
        unpaidAmount: "¥ 0",
        unticketedAmount: "¥ 27,600",
        status: "已支付",
        statusTone: "green",
      },
      {
        id: "CGHT-202601-088",
        contractCode: "CGHT-202601-088",
        projectName: "智慧工地综合监管平台二期",
        supplier: "黔途设备协作中心",
        contractAmount: "¥ 220,000",
        ticketAmount: "¥ 180,000",
        paidAmount: "¥ 100,000",
        unpaidAmount: "¥ 80,000",
        unticketedAmount: "¥ 40,000",
        status: "部分支付",
        statusTone: "purple",
      },
    ],
    expenseBars: [
      { label: "差旅费", amount: "¥ 132,000", percent: "36.7%", width: "36.7%", tone: "" },
      { label: "业务招待费", amount: "¥ 86,000", percent: "23.9%", width: "23.9%", tone: "green" },
      { label: "办公费", amount: "¥ 54,000", percent: "15.0%", width: "15.0%", tone: "gold" },
      { label: "交通费", amount: "¥ 48,000", percent: "13.3%", width: "13.3%", tone: "purple" },
      { label: "其他", amount: "¥ 40,000", percent: "11.1%", width: "11.1%", tone: "red" },
    ],
    expenseSummary: [
      { id: "罗晴", user: "罗晴", dept: "交付实施部", expenseAmount: "¥ 68,500", costAmount: "¥ 63,200", expenseCount: "4", advanceCount: "1" },
      { id: "秦羽", user: "秦羽", dept: "研发中心", expenseAmount: "¥ 58,200", costAmount: "¥ 54,900", expenseCount: "3", advanceCount: "0" },
      { id: "韩青", user: "韩青", dept: "交付实施部", expenseAmount: "¥ 44,600", costAmount: "¥ 40,800", expenseCount: "3", advanceCount: "1" },
      { id: "杜言", user: "杜言", dept: "产品中心", expenseAmount: "¥ 32,300", costAmount: "¥ 29,500", expenseCount: "2", advanceCount: "0" },
      { id: "程远", user: "程远", dept: "测试质量部", expenseAmount: "¥ 29,800", costAmount: "¥ 27,300", expenseCount: "2", advanceCount: "0" },
      { id: "苏莹", user: "苏莹", dept: "研发中心", expenseAmount: "¥ 24,400", costAmount: "¥ 22,600", expenseCount: "2", advanceCount: "1" },
    ],
    laborTrend: [
      { month: "2026-01", amount: "¥ 192,000", hours: "388h", headcount: "10人" },
      { month: "2026-02", amount: "¥ 218,000", hours: "426h", headcount: "11人" },
      { month: "2026-03", amount: "¥ 248,000", hours: "468h", headcount: "12人" },
      { month: "2026-04", amount: "¥ 322,000", hours: "596h", headcount: "14人" },
    ],
    laborRows: [
      { id: "LUOQING-202604", name: "罗晴", dept: "交付实施部", role: "项目经理", month: "2026-04", projectHours: "156h", unitCost: "¥ 338/h", laborCost: "¥ 52,728" },
      { id: "QINYU-202604", name: "秦羽", dept: "研发中心", role: "前端工程师", month: "2026-04", projectHours: "148h", unitCost: "¥ 298/h", laborCost: "¥ 44,104" },
      { id: "HANQING-202604", name: "韩青", dept: "交付实施部", role: "实施顾问", month: "2026-04", projectHours: "168h", unitCost: "¥ 226/h", laborCost: "¥ 37,968" },
      { id: "DUYAN-202604", name: "杜言", dept: "产品中心", role: "产品经理", month: "2026-04", projectHours: "132h", unitCost: "¥ 246/h", laborCost: "¥ 32,472" },
      { id: "CHENGYUAN-202604", name: "程远", dept: "测试质量部", role: "测试工程师", month: "2026-04", projectHours: "146h", unitCost: "¥ 205/h", laborCost: "¥ 29,930" },
      { id: "SUYING-202604", name: "苏莹", dept: "研发中心", role: "后端工程师", month: "2026-04", projectHours: "152h", unitCost: "¥ 304/h", laborCost: "¥ 46,208" },
    ],
  },
];

const suppliersData = [
  {
    id: "supplier-1",
    name: "成都天擎科技有限公司",
    taxNo: "91510100MA62FK2H7L",
    contact: "唐婧",
    phone: "13800001236",
    taxType: "一般纳税人",
    productCount: "8",
    updatedAt: "2026-04-08 10:26",
    address: "成都市高新区天府三街 188 号",
    bank: "招商银行成都软件园支行",
    account: "5105 0123 4567 8890",
    remark: "项目设备与集成类供应商",
    products: [
      { id: "P1", name: "边缘采集网关", spec: "TG-9000", unit: "台", price: "¥ 16,800.00", remark: "含基础安装包" },
      { id: "P2", name: "数据采集服务", spec: "驻场 3 人月", unit: "项", price: "¥ 86,000.00", remark: "可按项目拆分" },
      { id: "P3", name: "可视化展示屏", spec: "55 寸壁挂", unit: "套", price: "¥ 12,500.00", remark: "含支架" },
      { id: "P4", name: "运维巡检包", spec: "季度版", unit: "项", price: "¥ 28,000.00", remark: "季度运维" },
      { id: "P5", name: "接口实施服务", spec: "按接口包", unit: "项", price: "¥ 42,000.00", remark: "基础接口 10 个起" },
      { id: "P6", name: "临时驻场支持", spec: "按人天", unit: "天", price: "¥ 1,200.00", remark: "用于分页演示" },
      { id: "P7", name: "工业级交换机", spec: "8 口千兆导轨式", unit: "台", price: "¥ 3,680.00", remark: "适配边缘机柜部署" },
      { id: "P8", name: "现场实施培训", spec: "2 天标准场次", unit: "场", price: "¥ 6,800.00", remark: "含操作培训与交付答疑" },
    ],
    history: [
      { id: "H1", contractCode: "CGHT-202604-001", projectName: "城市交通数据中台建设一期", productName: "边缘采集网关", spec: "TG-9000", qty: "12", price: "¥ 16,800.00", unit: "台", amount: "¥ 201,600.00", date: "2026-04-01" },
      { id: "H2", contractCode: "CGHT-202604-001", projectName: "城市交通数据中台建设一期", productName: "数据采集服务", spec: "驻场 3 人月", qty: "1", price: "¥ 86,000.00", unit: "项", amount: "¥ 86,000.00", date: "2026-04-01" },
      { id: "H3", contractCode: "CGHT-202603-102", projectName: "智慧工地综合监管平台二期", productName: "接口实施服务", spec: "标准包", qty: "2", price: "¥ 42,000.00", unit: "项", amount: "¥ 84,000.00", date: "2026-03-16" },
      { id: "H4", contractCode: "CGHT-202602-090", projectName: "城市交通数据中台建设一期", productName: "运维巡检包", spec: "季度版", qty: "1", price: "¥ 28,000.00", unit: "项", amount: "¥ 28,000.00", date: "2026-02-20" },
      { id: "H5", contractCode: "CGHT-202601-075", projectName: "智慧工地综合监管平台一期", productName: "可视化展示屏", spec: "55 寸壁挂", qty: "4", price: "¥ 12,500.00", unit: "套", amount: "¥ 50,000.00", date: "2026-01-24" },
      { id: "H6", contractCode: "CGHT-202512-032", projectName: "智慧工地综合监管平台一期", productName: "临时驻场支持", spec: "按人天", qty: "20", price: "¥ 1,200.00", unit: "天", amount: "¥ 24,000.00", date: "2025-12-18" },
    ],
  },
  { id: "supplier-2", name: "云图集成服务有限公司", taxNo: "91510100MA65QK22A1", contact: "顾楠", phone: "13600002345", taxType: "一般纳税人", productCount: "4", updatedAt: "2026-04-07 14:12", address: "成都市武侯区科华北路 99 号", bank: "建设银行成都武侯支行", account: "5105 0166 9988 1022", remark: "系统集成与安装服务", products: [], history: [] },
  { id: "supplier-3", name: "川维设备服务有限公司", taxNo: "91510100MA61CF90B8", contact: "李旻", phone: "13900005678", taxType: "小规模纳税人", productCount: "3", updatedAt: "2026-04-06 09:41", address: "成都市锦江区水碾河南三街 1 号", bank: "工商银行成都双桥支行", account: "6222 0812 9900 2334", remark: "设备维护与巡检", products: [], history: [] },
  { id: "supplier-4", name: "贵安天行科技有限公司", taxNo: "91520100MA6P5A112Q", contact: "宋宇", phone: "15100001289", taxType: "一般纳税人", productCount: "6", updatedAt: "2026-04-05 11:20", address: "贵阳市观山湖区长岭北路 8 号", bank: "交通银行贵阳分行", account: "6228 4888 1000 9987", remark: "工地监管类项目供应商", products: [], history: [] },
  { id: "supplier-5", name: "贵黔智联设备有限公司", taxNo: "91520100MA6PX2108L", contact: "尹哲", phone: "15200004321", taxType: "一般纳税人", productCount: "2", updatedAt: "2026-04-04 17:05", address: "贵阳市南明区花果园双子塔", bank: "农业银行贵阳南明支行", account: "6228 4808 1177 6632", remark: "硬件设备集成", products: [], history: [] },
  { id: "supplier-6", name: "西南运维协作中心", taxNo: "91510100MA6TQ1176D", contact: "邹凯", phone: "13300007890", taxType: "小规模纳税人", productCount: "5", updatedAt: "2026-04-03 16:48", address: "成都市高新区天顺南街 58 号", bank: "民生银行成都高新支行", account: "6956 0011 2233 5544", remark: "驻场运维与临时支持", products: [], history: [] },
];

const expenseDetailRows = [
  { id: "E1", code: "BX-202604-001", reason: "成都驻场差旅", type: "项目报销", date: "2026-04-05", total: "¥ 18,600", approve: "出差申请 OA-202604-019", invoice: "是", payee: "员工垫付", remark: "含机票、住宿与市内交通。" },
  { id: "E2", code: "BX-202603-011", reason: "客户汇报交通与住宿", type: "项目报销", date: "2026-03-28", total: "¥ 12,400", approve: "业务招待 OA-202603-055", invoice: "否", payee: "员工垫付", remark: "跨城汇报行程，住宿按标准报销。" },
  { id: "E3", code: "BX-202603-004", reason: "办公用品补充采购", type: "项目报销", date: "2026-03-12", total: "¥ 8,600", approve: "行政采购 OA-202603-048", invoice: "是", payee: "对公采购后个人补垫", remark: "补充会议室耗材与标签打印纸。" },
  { id: "E4", code: "BX-202602-017", reason: "高速通行与油费", type: "项目报销", date: "2026-02-26", total: "¥ 6,800", approve: "用车申请 OA-202602-101", invoice: "否", payee: "员工垫付", remark: "项目现场往返用车费用。" },
  { id: "E5", code: "BX-202602-006", reason: "会议接待", type: "项目报销", date: "2026-02-11", total: "¥ 5,200", approve: "业务招待 OA-202602-034", invoice: "是", payee: "员工垫付", remark: "项目阶段会议茶歇与接待餐费。" },
  { id: "E6", code: "BX-202601-002", reason: "启动期差旅", type: "项目报销", date: "2026-01-20", total: "¥ 4,800", approve: "出差申请 OA-202601-016", invoice: "是", payee: "员工垫付", remark: "项目启动会往返交通与住宿。" },
  { id: "E7", code: "BX-202601-009", reason: "现场网络调测补贴", type: "项目报销", date: "2026-01-26", total: "¥ 3,600", approve: "现场实施 OA-202601-044", invoice: "否", payee: "员工垫付", remark: "夜间调测餐补与打车费。" },
  { id: "E8", code: "BX-202512-015", reason: "专家评审资料制作", type: "项目报销", date: "2025-12-23", total: "¥ 2,900", approve: "评审准备 OA-202512-072", invoice: "是", payee: "员工垫付", remark: "打印装订及资料邮寄费用。" },
  { id: "E9", code: "BX-202512-008", reason: "施工现场临时布线材料", type: "项目报销", date: "2025-12-12", total: "¥ 3,450", approve: "现场采购 OA-202512-041", invoice: "是", payee: "员工垫付", remark: "现场应急补充网线、标签与转接件。" },
  { id: "E10", code: "BX-202511-006", reason: "项目例会交通与餐费", type: "项目报销", date: "2025-11-19", total: "¥ 2,280", approve: "项目例会 OA-202511-033", invoice: "否", payee: "员工垫付", remark: "跨区往返交通与加班餐费。" },
];

const advanceDetailRows = [
  { id: "A1", code: "JK-202603-001", amount: "¥ 8,000", date: "2026-03-09", status: "待核销", remark: "驻场差旅借款", purpose: "成都驻场首周交通及住宿周转", expectedWriteoff: "2026-04-20" },
  { id: "A2", code: "JK-202602-003", amount: "¥ 4,500", date: "2026-02-10", status: "部分核销", remark: "客户汇报交通借款", purpose: "跨城汇报与现场交通备用金", expectedWriteoff: "2026-03-10" },
  { id: "A3", code: "JK-202601-002", amount: "¥ 3,000", date: "2026-01-18", status: "已核销", remark: "启动会借款", purpose: "项目启动会差旅与接待备用金", expectedWriteoff: "2026-01-31" },
  { id: "A4", code: "JK-202512-011", amount: "¥ 2,000", date: "2025-12-18", status: "已核销", remark: "历史数据", purpose: "现场调研油费及过路费", expectedWriteoff: "2025-12-31" },
  { id: "A5", code: "JK-202512-008", amount: "¥ 1,500", date: "2025-12-06", status: "已核销", remark: "历史数据", purpose: "项目评审材料快递及打印", expectedWriteoff: "2025-12-20" },
  { id: "A6", code: "JK-202511-004", amount: "¥ 1,200", date: "2025-11-18", status: "已核销", remark: "历史数据", purpose: "前期调研市内交通借款", expectedWriteoff: "2025-11-30" },
  { id: "A7", code: "JK-202511-009", amount: "¥ 2,800", date: "2025-11-26", status: "已核销", remark: "设备到货接应借款", purpose: "临时装卸与车辆调度备用金", expectedWriteoff: "2025-12-08" },
  { id: "A8", code: "JK-202510-003", amount: "¥ 1,000", date: "2025-10-22", status: "已核销", remark: "方案汇报借款", purpose: "客户方案沟通当天交通与餐费", expectedWriteoff: "2025-10-31" },
  { id: "A9", code: "JK-202510-011", amount: "¥ 2,200", date: "2025-10-28", status: "已核销", remark: "现场设备搬运借款", purpose: "设备进场搬运及临时用工备用金", expectedWriteoff: "2025-11-08" },
  { id: "A10", code: "JK-202509-007", amount: "¥ 1,600", date: "2025-09-15", status: "已核销", remark: "前期踏勘借款", purpose: "前期踏勘交通、打印与现场协调费用", expectedWriteoff: "2025-09-25" },
];

const customersData = [
  {
    id: "customer-1",
    code: "KH-001",
    name: "成都数智交通集团有限公司",
    taxId: "91510100MA6C9X4R3A",
    address: "成都市高新区府城大道 66 号 18F",
    phone: "028-85223344",
    bankName: "建设银行成都天府支行",
    bankAccount: "5105 0188 6677 1234",
    remark: "城市交通数据中台及扩容项目统一开票主体。",
    createdAt: "2026-01-12 09:18",
    updatedAt: "2026-04-08 10:12",
    createdBy: "刘敏",
    contractCount: 3,
    invoiceCount: 6,
    linkedContracts: ["HT-2026-001", "HT-2026-008", "HT-2026-011"],
  },
  {
    id: "customer-2",
    code: "KH-002",
    name: "贵州智慧工地建设投资有限公司",
    taxId: "91520115MA6JH2K77C",
    address: "贵阳市观山湖区林城西路 95 号 12F",
    phone: "0851-88991234",
    bankName: "中国银行贵阳会展城支行",
    bankAccount: "6216 6001 8899 2301",
    remark: "二期智慧工地项目主合同客户。",
    createdAt: "2026-01-25 14:36",
    updatedAt: "2026-04-07 16:45",
    createdBy: "罗晴",
    contractCount: 2,
    invoiceCount: 4,
    linkedContracts: ["HT-2026-015", "HT-2026-019"],
  },
  {
    id: "customer-3",
    code: "KH-003",
    name: "重庆城运科技股份有限公司",
    taxId: "91500000MA61QW332M",
    address: "重庆市渝北区金开大道 80 号 7 栋",
    phone: "023-67891234",
    bankName: "招商银行重庆两江支行",
    bankAccount: "6214 8388 0011 2736",
    remark: "轨道交通数据治理试点客户。",
    createdAt: "2026-02-08 11:02",
    updatedAt: "2026-04-05 18:10",
    createdBy: "周舟",
    contractCount: 1,
    invoiceCount: 2,
    linkedContracts: ["HT-2026-028"],
  },
  {
    id: "customer-4",
    code: "KH-004",
    name: "川南产业数字化有限公司",
    taxId: "",
    address: "泸州市江阳区康城路 18 号 5 层",
    phone: "0830-3188009",
    bankName: "",
    bankAccount: "",
    remark: "客户资料待补齐，目前仅用于商机跟进。",
    createdAt: "2026-03-02 09:40",
    updatedAt: "2026-04-04 09:15",
    createdBy: "杜言",
    contractCount: 0,
    invoiceCount: 0,
    linkedContracts: [],
  },
  {
    id: "customer-5",
    code: "KH-005",
    name: "西部应急指挥技术中心",
    taxId: "12510000450781234A",
    address: "成都市武侯区益州大道 88 号",
    phone: "028-83220018",
    bankName: "工商银行成都高新支行",
    bankAccount: "6222 0811 7788 9021",
    remark: "开票资料完整，可直接用于合同新增。",
    createdAt: "2026-03-18 15:28",
    updatedAt: "2026-04-06 13:21",
    createdBy: "陈澈",
    contractCount: 0,
    invoiceCount: 0,
    linkedContracts: [],
  },
  {
    id: "customer-6",
    code: "KH-006",
    name: "成渝协同创新研究院",
    taxId: "91510100MA6TR9912L",
    address: "成都市天府新区科学城北路 66 号",
    phone: "028-86116627",
    bankName: "农业银行成都科学城支行",
    bankAccount: "6228 4802 9911 0067",
    remark: "已完成基础资料建档，待首份合同落地。",
    createdAt: "2026-04-01 10:05",
    updatedAt: "2026-04-08 08:32",
    createdBy: "韩青",
    contractCount: 0,
    invoiceCount: 0,
    linkedContracts: [],
  },
];

const plansData = [
  { id: "CGJH-202604-001", code: "CGJH-202604-001", projectName: "城市交通数据中台建设一期", reason: "补充边缘采集设备和接口实施服务", categories: "设备采购、服务采购", budget: "¥ 1,260,000", bidFlag: "是", bidTone: "gold", status: "草稿", statusTone: "blue", applicant: "张晨", date: "2026-04-08" },
  { id: "CGJH-202604-002", code: "CGJH-202604-002", projectName: "智慧工地综合监管平台二期", reason: "阶段二现场采集设备增补", categories: "设备采购", budget: "¥ 980,000", bidFlag: "否", bidTone: "green", status: "审批中", statusTone: "gold", applicant: "罗晴", date: "2026-04-07" },
  { id: "CGJH-202603-006", code: "CGJH-202603-006", projectName: "城市交通数据中台建设一期", reason: "驻场运维与巡检包采购", categories: "服务采购", budget: "¥ 360,000", bidFlag: "否", bidTone: "green", status: "已通过", statusTone: "green", applicant: "周舟", date: "2026-03-29" },
  { id: "CGJH-202603-003", code: "CGJH-202603-003", projectName: "智慧工地综合监管平台二期", reason: "监管大屏与展示终端采购", categories: "设备采购、办公采购", budget: "¥ 520,000", bidFlag: "是", bidTone: "gold", status: "已拒绝", statusTone: "red", applicant: "陈澈", date: "2026-03-18" },
  { id: "CGJH-202602-011", code: "CGJH-202602-011", projectName: "城市交通数据中台建设一期", reason: "测试环境扩容与材料采购", categories: "材料采购、软件采购", budget: "¥ 410,000", bidFlag: "否", bidTone: "green", status: "已撤回", statusTone: "purple", applicant: "李岚", date: "2026-02-25" },
  { id: "CGJH-202602-005", code: "CGJH-202602-005", projectName: "智慧工地综合监管平台二期", reason: "施工现场临时办公采购", categories: "行政采购", budget: "¥ 180,000", bidFlag: "否", bidTone: "green", status: "已通过", statusTone: "green", applicant: "杜言", date: "2026-02-12" },
];

const requestsData = [
  { id: "CGSQ-202604-001", code: "CGSQ-202604-001", projectName: "城市交通数据中台建设一期", reason: "采购边缘采集网关及现场安装服务", category: "设备采购", needInquiry: "是", inquiryTone: "gold", supplier: "-", amount: "¥ 1,080,000", status: "已通过", statusTone: "green", applicant: "张晨", date: "2026-04-08" },
  { id: "CGSQ-202604-002", code: "CGSQ-202604-002", projectName: "智慧工地综合监管平台二期", reason: "采购工地监管摄像头与安装辅材", category: "设备采购", needInquiry: "否", inquiryTone: "green", supplier: "贵黔智联设备有限公司", amount: "¥ 520,000", status: "已通过", statusTone: "green", applicant: "罗晴", date: "2026-04-06" },
  { id: "CGSQ-202603-005", code: "CGSQ-202603-005", projectName: "城市交通数据中台建设一期", reason: "驻场运维与巡检支持服务", category: "服务采购", needInquiry: "否", inquiryTone: "green", supplier: "西南运维协作中心", amount: "¥ 290,000", status: "已通过", statusTone: "green", applicant: "周舟", date: "2026-03-25" },
  { id: "CGSQ-202603-003", code: "CGSQ-202603-003", projectName: "智慧工地综合监管平台二期", reason: "现场展示大屏与布线施工", category: "设备采购", needInquiry: "是", inquiryTone: "gold", supplier: "-", amount: "¥ 760,000", status: "已通过", statusTone: "green", applicant: "陈澈", date: "2026-03-16" },
  { id: "CGSQ-202602-012", code: "CGSQ-202602-012", projectName: "城市交通数据中台建设一期", reason: "测试环境扩容服务器与软件许可", category: "软件采购", needInquiry: "否", inquiryTone: "green", supplier: "云图集成服务有限公司", amount: "¥ 410,000", status: "已撤回", statusTone: "purple", applicant: "李岚", date: "2026-02-26" },
  { id: "CGSQ-202602-008", code: "CGSQ-202602-008", projectName: "智慧工地综合监管平台二期", reason: "现场临时办公与安全物资采购", category: "行政采购", needInquiry: "否", inquiryTone: "green", supplier: "贵安天行科技有限公司", amount: "¥ 180,000", status: "已拒绝", statusTone: "red", applicant: "杜言", date: "2026-02-14" },
];

const inquiriesData = [
  { id: "BJXJ-202604-001", code: "BJXJ-202604-001", projectName: "城市交通数据中台建设一期", requestCode: "CGSQ-202604-001", target: "边缘采集网关、安装调试服务", status: "待确认供应商", statusTone: "gold", supplier: "-", amount: "-", applicant: "张晨", date: "2026-04-08" },
  { id: "BJXJ-202604-002", code: "BJXJ-202604-002", projectName: "智慧工地综合监管平台二期", requestCode: "CGSQ-202603-003", target: "现场展示大屏与布线施工", status: "确定供应商待审核", statusTone: "purple", supplier: "贵黔智联设备有限公司", amount: "¥ 760,000", applicant: "陈澈", date: "2026-04-05" },
  { id: "BJXJ-202603-005", code: "BJXJ-202603-005", projectName: "智慧工地综合监管平台二期", requestCode: "CGSQ-202603-003", target: "摄像头及辅材采购", status: "已确定供应商", statusTone: "green", supplier: "贵安天行科技有限公司", amount: "¥ 980,000", applicant: "罗晴", date: "2026-03-30" },
  { id: "BJXJ-202603-003", code: "BJXJ-202603-003", projectName: "城市交通数据中台建设一期", requestCode: "CGSQ-202603-011", target: "网络交换机与机柜辅材", status: "待审核", statusTone: "red", supplier: "-", amount: "-", applicant: "李岚", date: "2026-03-21" },
  { id: "BJXJ-202602-007", code: "BJXJ-202602-007", projectName: "智慧工地综合监管平台二期", requestCode: "CGSQ-202602-019", target: "培训服务与实施顾问驻场", status: "已确定供应商", statusTone: "green", supplier: "中黔信息服务有限公司", amount: "¥ 330,000", applicant: "程远", date: "2026-02-26" },
  { id: "BJXJ-202602-004", code: "BJXJ-202602-004", projectName: "城市交通数据中台建设一期", requestCode: "CGSQ-202602-015", target: "监控设备扩容", status: "待确认供应商", statusTone: "gold", supplier: "-", amount: "-", applicant: "周舟", date: "2026-02-12" },
];

const contractsData = [
  { id: "CGHT-202604-001", code: "CGHT-202604-001", projectName: "城市交通数据中台建设一期", supplier: "成都天擎科技有限公司", sourceType: "比价", sourceTone: "blue", amount: "¥ 1,260,000", copies: "4", status: "已通过", statusTone: "green", date: "2026-04-08" },
  { id: "CGHT-202604-002", code: "CGHT-202604-002", projectName: "智慧工地综合监管平台二期", supplier: "贵安天行科技有限公司", sourceType: "比价", sourceTone: "blue", amount: "¥ 980,000", copies: "3", status: "已通过", statusTone: "green", date: "2026-04-06" },
  { id: "CGHT-202603-006", code: "CGHT-202603-006", projectName: "城市交通数据中台建设一期", supplier: "西南运维协作中心", sourceType: "直采", sourceTone: "green", amount: "¥ 290,000", copies: "2", status: "已通过", statusTone: "green", date: "2026-03-26" },
  { id: "CGHT-202603-003", code: "CGHT-202603-003", projectName: "智慧工地综合监管平台二期", supplier: "贵黔智联设备有限公司", sourceType: "直采", sourceTone: "green", amount: "¥ 520,000", copies: "3", status: "已通过", statusTone: "green", date: "2026-03-18" },
  { id: "CGHT-202602-011", code: "CGHT-202602-011", projectName: "城市交通数据中台建设一期", supplier: "云图集成服务有限公司", sourceType: "直采", sourceTone: "green", amount: "¥ 410,000", copies: "2", status: "已通过", statusTone: "green", date: "2026-02-28" },
  { id: "CGHT-202602-008", code: "CGHT-202602-008", projectName: "智慧工地综合监管平台二期", supplier: "中黔信息服务有限公司", sourceType: "比价", sourceTone: "blue", amount: "¥ 330,000", copies: "2", status: "已通过", statusTone: "green", date: "2026-02-14" },
];

const paymentRequestsData = [
  { id: "FKSQ-202604-001", code: "FKSQ-202604-001", contractCode: "CGHT-202604-001", projectName: "城市交通数据中台建设一期", supplier: "成都天擎科技有限公司", contractAmount: "¥ 1,260,000", requestAmount: "¥ 620,000", bank: "招商银行成都软件园支行", status: "已通过", statusTone: "green", applicant: "张晨", date: "2026-04-08" },
  { id: "FKSQ-202604-002", code: "FKSQ-202604-002", contractCode: "CGHT-202604-002", projectName: "智慧工地综合监管平台二期", supplier: "贵安天行科技有限公司", contractAmount: "¥ 980,000", requestAmount: "¥ 480,000", bank: "交通银行贵阳分行", status: "已通过", statusTone: "green", applicant: "罗晴", date: "2026-04-06" },
  { id: "FKSQ-202603-006", code: "FKSQ-202603-006", contractCode: "CGHT-202603-006", projectName: "城市交通数据中台建设一期", supplier: "西南运维协作中心", contractAmount: "¥ 290,000", requestAmount: "¥ 120,000", bank: "民生银行成都高新支行", status: "已通过", statusTone: "green", applicant: "周舟", date: "2026-03-28" },
  { id: "FKSQ-202603-003", code: "FKSQ-202603-003", contractCode: "CGHT-202603-003", projectName: "智慧工地综合监管平台二期", supplier: "贵黔智联设备有限公司", contractAmount: "¥ 520,000", requestAmount: "¥ 260,000", bank: "农业银行贵阳南明支行", status: "已通过", statusTone: "green", applicant: "陈澈", date: "2026-03-19" },
  { id: "FKSQ-202602-011", code: "FKSQ-202602-011", contractCode: "CGHT-202602-011", projectName: "城市交通数据中台建设一期", supplier: "云图集成服务有限公司", contractAmount: "¥ 410,000", requestAmount: "¥ 180,000", bank: "建设银行成都武侯支行", status: "审批中", statusTone: "gold", applicant: "李岚", date: "2026-02-28" },
  { id: "FKSQ-202602-008", code: "FKSQ-202602-008", contractCode: "CGHT-202602-008", projectName: "智慧工地综合监管平台二期", supplier: "中黔信息服务有限公司", contractAmount: "¥ 330,000", requestAmount: "¥ 150,000", bank: "中国银行贵阳分行", status: "已拒绝", statusTone: "red", applicant: "程远", date: "2026-02-16" },
];

const paymentManagementData = [
  {
    id: "FKSQ-202604-001",
    code: "FKSQ-202604-001",
    projectName: "城市交通数据中台建设一期",
    contractCode: "CGHT-202604-001",
    supplier: "成都天擎科技有限公司",
    requestAmount: "¥ 620,000",
    account: "招商银行成都软件园支行 / 5105 0123 4567 8890",
    paidAmount: "¥ 420,000",
    unpaidAmount: "¥ 200,000",
    status: "部分支付",
    statusTone: "purple",
    history: [
      { id: "ZF-202604-001", amount: "¥ 220,000", method: "银行转账", date: "2026-04-08", voucher: "支付回单-1.pdf", operator: "财务 李倩", time: "2026-04-08 14:22", remark: "首笔支付" },
      { id: "ZF-202604-004", amount: "¥ 200,000", method: "银行转账", date: "2026-04-10", voucher: "支付回单-2.pdf", operator: "财务 李倩", time: "2026-04-10 09:16", remark: "二次支付" },
      { id: "ZF-202604-007", amount: "¥ 0", method: "银行转账", date: "2026-04-12", voucher: "待生成", operator: "财务 李倩", time: "2026-04-12 11:00", remark: "预留记录用于分页" },
      { id: "ZF-202604-010", amount: "¥ 0", method: "承兑", date: "2026-04-13", voucher: "待生成", operator: "财务 李倩", time: "2026-04-13 16:20", remark: "预留记录用于分页" },
      { id: "ZF-202604-013", amount: "¥ 0", method: "现金", date: "2026-04-14", voucher: "待生成", operator: "财务 李倩", time: "2026-04-14 10:35", remark: "预留记录用于分页" },
      { id: "ZF-202604-016", amount: "¥ 0", method: "其他", date: "2026-04-15", voucher: "待生成", operator: "财务 李倩", time: "2026-04-15 13:45", remark: "预留记录用于分页" },
    ],
  },
  {
    id: "FKSQ-202604-002",
    code: "FKSQ-202604-002",
    projectName: "智慧工地综合监管平台二期",
    contractCode: "CGHT-202604-002",
    supplier: "贵安天行科技有限公司",
    requestAmount: "¥ 480,000",
    account: "交通银行贵阳分行 / 6228 4888 1000 9987",
    paidAmount: "¥ 180,000",
    unpaidAmount: "¥ 300,000",
    status: "部分支付",
    statusTone: "purple",
    history: [
      { id: "ZF-202604-002", amount: "¥ 180,000", method: "银行转账", date: "2026-04-07", voucher: "付款回执.pdf", operator: "财务 邱璇", time: "2026-04-07 15:08", remark: "首期支付" },
    ],
  },
  { id: "FKSQ-202603-006", code: "FKSQ-202603-006", projectName: "城市交通数据中台建设一期", contractCode: "CGHT-202603-006", supplier: "西南运维协作中心", requestAmount: "¥ 120,000", account: "民生银行成都高新支行 / 6956 0011 2233 5544", paidAmount: "¥ 120,000", unpaidAmount: "¥ 0", status: "已支付", statusTone: "green", history: [{ id: "ZF-202603-018", amount: "¥ 120,000", method: "银行转账", date: "2026-03-29", voucher: "民生支付回单.pdf", operator: "财务 李倩", time: "2026-03-29 18:32", remark: "支付完成" }] },
  { id: "FKSQ-202603-003", code: "FKSQ-202603-003", projectName: "智慧工地综合监管平台二期", contractCode: "CGHT-202603-003", supplier: "贵黔智联设备有限公司", requestAmount: "¥ 260,000", account: "农业银行贵阳南明支行 / 6228 4808 1177 6632", paidAmount: "¥ 0", unpaidAmount: "¥ 260,000", status: "待支付", statusTone: "red", history: [] },
];

const stockInboundData = [
  { id: "RK-202604-001", code: "RK-202604-001", name: "边缘采集网关", spec: "TG-9000", unit: "台", qty: "12", place: "A-01 设备库", source: "采购合同 CGHT-202604-001", user: "张晨", time: "2026-04-08 16:20", remark: "设备齐套入库" },
  { id: "RK-202604-002", code: "RK-202604-002", name: "可视化展示屏", spec: "55 寸壁挂", unit: "套", qty: "4", place: "A-02 展示库", source: "采购合同 CGHT-202603-003", user: "陈澈", time: "2026-04-07 11:10", remark: "现场调拨后入库" },
  { id: "RK-202603-006", code: "RK-202603-006", name: "网络交换机", spec: "24 口千兆", unit: "台", qty: "6", place: "B-01 弱电库", source: "采购合同 CGHT-202603-006", user: "李岚", time: "2026-03-28 17:45", remark: "测试环境扩容" },
  { id: "RK-202603-003", code: "RK-202603-003", name: "工地监管摄像头", spec: "4K 云台", unit: "台", qty: "10", place: "C-03 项目仓", source: "采购合同 CGHT-202604-002", user: "罗晴", time: "2026-03-22 09:20", remark: "分批入库" },
  { id: "RK-202602-009", code: "RK-202602-009", name: "办公椅", spec: "人体工学", unit: "把", qty: "8", place: "行政库位", source: "行政采购", user: "杜言", time: "2026-02-20 15:08", remark: "现场办公配套" },
  { id: "RK-202602-004", code: "RK-202602-004", name: "布线辅材", spec: "标准套件", unit: "箱", qty: "5", place: "B-02 综合库", source: "采购合同 CGHT-202602-008", user: "韩青", time: "2026-02-12 10:15", remark: "批量入库" },
];

const stockOutboundData = [
  { id: "CK-202604-001", code: "CK-202604-001", name: "边缘采集网关", spec: "TG-9000", unit: "台", qty: "4", target: "一期项目现场安装", owner: "安装组 / 王晟", user: "张晨", time: "2026-04-09 09:30", remark: "首批发往现场" },
  { id: "CK-202604-002", code: "CK-202604-002", name: "可视化展示屏", spec: "55 寸壁挂", unit: "套", qty: "2", target: "监管大厅展示墙", owner: "实施部 / 罗晴", user: "陈澈", time: "2026-04-08 14:00", remark: "现场安装使用" },
  { id: "CK-202603-006", code: "CK-202603-006", name: "网络交换机", spec: "24 口千兆", unit: "台", qty: "2", target: "测试环境部署", owner: "研发中心 / 李岚", user: "李岚", time: "2026-03-29 16:45", remark: "测试机房使用" },
  { id: "CK-202603-003", code: "CK-202603-003", name: "工地监管摄像头", spec: "4K 云台", unit: "台", qty: "6", target: "工地 2 号标段", owner: "项目部 / 罗晴", user: "罗晴", time: "2026-03-23 11:30", remark: "按批次发放" },
  { id: "CK-202602-009", code: "CK-202602-009", name: "办公椅", spec: "人体工学", unit: "把", qty: "4", target: "现场项目办公室", owner: "行政部 / 杜言", user: "杜言", time: "2026-02-21 10:10", remark: "现场办公使用" },
  { id: "CK-202602-004", code: "CK-202602-004", name: "布线辅材", spec: "标准套件", unit: "箱", qty: "2", target: "布线施工", owner: "实施组 / 韩青", user: "韩青", time: "2026-02-13 13:22", remark: "现场施工领用" },
];

const pages = {
  invoice: { group: "财务管理", title: "开票回款", render: renderInvoicePage },
  cost: { group: "财务管理", title: "成本费用", render: renderCostPage },
  revenue: { group: "财务管理", title: "收入确认", render: renderRevenuePage },
  "payment-management": { group: "财务管理", title: "支付管理", render: renderPaymentManagementPage },
  suppliers: { group: "采购管理", title: "供应商管理", render: renderSuppliersPage },
  "supplier-history": { group: "采购管理", title: "供应商采购历史", render: renderSupplierHistoryPage },
  plans: { group: "采购管理", title: "采购计划", render: renderPlansPage },
  requests: { group: "采购管理", title: "采购申请", render: renderRequestsPage },
  inquiries: { group: "采购管理", title: "比价询价", render: renderInquiriesPage },
  contracts: { group: "采购管理", title: "采购合同签订", render: renderContractsPage },
  "payment-requests": { group: "采购管理", title: "付款申请", render: renderPaymentRequestsPage },
  stock: { group: "采购管理", title: "出入库登记", render: renderStockPage },
  customers: { group: "项目管理", title: "客户管理", render: renderCustomersPage },
};

const hashPage = window.location.hash.replace(/^#/, "");
if (pages[hashPage]) {
  state.activePage = hashPage;
}

function getProject() {
  return financeProjects.find((item) => item.id === state.currentProjectId) ?? financeProjects[0];
}

function getSupplier() {
  return suppliersData.find((item) => item.id === state.activeSupplierId) ?? suppliersData[0];
}

function hasCustomerBillingProfile(customer) {
  return [customer.taxId, customer.address, customer.phone, customer.bankName, customer.bankAccount].every(Boolean);
}

function getCustomerStats() {
  const totalContracts = customersData.reduce((sum, item) => sum + item.contractCount, 0);
  const linkedCount = customersData.filter((item) => item.contractCount > 0).length;
  const readyCount = customersData.filter(hasCustomerBillingProfile).length;
  const latest = customersData
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];

  return {
    total: customersData.length,
    linkedCount,
    readyCount,
    pendingCount: customersData.length - readyCount,
    totalContracts,
    latest,
  };
}

function statusTag(text, tone = "blue") {
  return `<span class="status-tag ${tone}">${text}</span>`;
}

function actionLink(label, action, rowId, extra = "") {
  return `<button class="btn link" type="button" data-action="${action}" data-row-id="${rowId}" ${extra}>${label}</button>`;
}

function divider() {
  return `<span class="divider" aria-hidden="true"></span>`;
}

function projectSwitch(project) {
  return `<div class="project-switch">
    <button class="project-current" type="button" data-action="open-project">
      <div class="project-meta">
        <div class="project-value">${project.code} ${project.name}</div>
      </div>
      <div class="project-trigger">
        <span class="tiny-tag blue">切换项目</span>
      </div>
    </button>
  </div>`;
}

function renderTerms(items) {
  return `<div class="term-list">${items
    .map(
      (item) => `<div class="term-card ${item.done ? "done" : ""}">
        ${item.done ? `<span class="term-check">✓</span>` : ""}
        <span>${item.text}</span>
      </div>`
    )
    .join("")}</div>`;
}

function renderStats(cards, fiveCol = false) {
  return `<div class="stats-grid ${fiveCol ? "five-col" : ""}">${cards
    .map(
      (card) => `<div class="stat-card ${card.cls ?? ""}">
        <div class="stat-label">${card.label}</div>
        <div class="stat-value">${card.value}</div>
        ${card.note ? `<div class="stat-note">${card.note}</div>` : ""}
      </div>`
    )
    .join("")}</div>`;
}

function inputControl(placeholder, size = "wide") {
  return `<input class="control-input filter-control filter-control-${size}" type="text" placeholder="${placeholder}" />`;
}

function selectControl(options, size = "narrow") {
  return `<select class="control-select filter-control filter-control-${size}">${options.map((item) => `<option>${item}</option>`).join("")}</select>`;
}

function dateControl() {
  return `<input class="control-date" type="date" />`;
}

function dateRangeControl(size = "range") {
  return `<div class="range-picker filter-control filter-control-${size}" role="button" tabindex="0" aria-label="选择时间范围">
    <svg class="range-picker-icon" viewBox="0 0 1024 1024" fill="currentColor" aria-hidden="true">
      <path d="M746.7 128v85.3H277.3V128h-64v85.3H128v640h768v-640h-85.3V128h-64zm85.3 149.3v128H192v-128h640zM192 789.3V469.3h640v320H192zm128-213.3h128v106.7H320V576zm192 0h128v106.7H512V576z"></path>
    </svg>
    <span class="range-picker-text range-picker-placeholder">开始日期</span>
    <span class="range-picker-sep">~</span>
    <span class="range-picker-text range-picker-placeholder">结束日期</span>
    <span class="range-picker-suffix">▼</span>
  </div>`;
}

function pageTable(config) {
  activeTables[config.key] = config;
  state.pagination[config.key] = state.pagination[config.key] ?? 1;
  return tableFrame(config);
}

function overlayTable(config) {
  overlayTables[config.key] = config;
  state.pagination[config.key] = state.pagination[config.key] ?? 1;
  return tableFrame(config);
}

function tableFrame(config) {
  return `<div class="table-card">
    ${
      config.toolbarLeft || config.toolbarRight
        ? `<div class="table-toolbar">
            <div class="table-toolbar-actions">
              <div class="toolbar-filters">${config.toolbarLeft ?? ""}${config.toolbarRight ?? ""}</div>
            </div>
          </div>`
        : ""
    }
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            ${config.columns
              .map(
                (column) =>
                  `<th style="${column.width ? `width:${column.width};` : ""}">${column.title}</th>`
              )
              .join("")}
          </tr>
        </thead>
        <tbody id="${config.key}-body"></tbody>
      </table>
    </div>
    <div class="pagination" id="${config.key}-pagination"></div>
  </div>`;
}

function renderTableByKey(key) {
  const config = activeTables[key] ?? modalTables[key] ?? drawerTables[key] ?? overlayTables[key];
  if (!config) return;
  const rows = config.rows ?? [];
  const pageSize = config.pageSize ?? 5;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  if (state.pagination[key] > totalPages) state.pagination[key] = totalPages;
  const start = (state.pagination[key] - 1) * pageSize;
  const currentRows = rows.slice(start, start + pageSize);
  const body = document.getElementById(`${key}-body`);
  const pager = document.getElementById(`${key}-pagination`);
  if (!body || !pager) return;
  body.innerHTML = currentRows.length
    ? currentRows.map((row) => renderRow(config, row)).join("")
    : `<tr><td colspan="${config.columns.length}"><div class="empty-state">暂无数据</div></td></tr>`;
  pager.innerHTML = renderPagination(key, rows.length, pageSize, state.pagination[key]);
}

function renderRow(config, row) {
  return `<tr>${config.columns
    .map((column) => `<td data-label="${column.title}">${column.render(row)}</td>`)
    .join("")}</tr>`;
}

function renderPagination(key, total, pageSize, currentPage) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pagesHtml = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button class="page-btn ${page === currentPage ? "active" : ""}" type="button" data-page-key="${key}" data-page="${page}">${page}</button>`;
  }).join("");
  return `<div class="pagination-info">共 ${total} 条</div>
    <div class="pagination-controls">
      <button class="page-btn" type="button" data-page-key="${key}" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? "disabled" : ""}>上一页</button>
      ${pagesHtml}
      <button class="page-btn" type="button" data-page-key="${key}" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? "disabled" : ""}>下一页</button>
    </div>`;
}

function renderAllTables(registry) {
  Object.keys(registry).forEach((key) => renderTableByKey(key));
}

function pageLayout(title, desc, body) {
  return `<div class="page-card">
    <div class="page-header">
      <div class="page-heading">
        <div>
          <h1 class="page-title">${title}</h1>
        </div>
      </div>
    </div>
    ${body}
  </div>`;
}

function renderInvoicePage() {
  const project = getProject();
  return pageLayout(
    "开票回款",
    "覆盖回款申请、开票申请、财务开票与回款登记的闭环页面；开票列表仅展示审批通过后完成财务办理的数据。",
    `<div class="toolbar">
      <div class="toolbar-left">${projectSwitch(project)}</div>
      <div class="toolbar-right">
        <button class="btn" type="button" data-action="invoice-request-modal">发起回款申请</button>
        <button class="btn primary" type="button" data-action="invoice-apply-modal">发起开票申请</button>
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-head">
        <p class="summary-title">项目信息</p>
      </div>
      <div class="summary-grid">
        <div class="summary-item"><div class="summary-item-label">客户经理</div><div class="summary-item-value">${project.accountManager}</div></div>
        <div class="summary-item"><div class="summary-item-label">项目经理</div><div class="summary-item-value">${project.projectManager}</div></div>
        <div class="summary-item"><div class="summary-item-label">客户名称</div><div class="summary-item-value">${project.customer}</div></div>
        <div class="summary-item"><div class="summary-item-label">合同名称</div><div class="summary-item-value">${project.contractName}</div></div>
        <div class="summary-item"><div class="summary-item-label">合同金额</div><div class="summary-item-value">${project.contractAmount}</div></div>
        <div class="summary-item"><div class="summary-item-label">合同签订日期</div><div class="summary-item-value">${project.contractSignDate}</div></div>
        <div class="summary-item span-full"><div class="summary-item-label">支付条件</div><div class="summary-item-value">${renderTerms(project.paymentTerms)}</div></div>
      </div>
    </div>
    ${renderStats(
      [
        { label: "可回款金额", value: project.invoiceStats.collectable, cls: "soft-blue" },
        { label: "已开票金额", value: project.invoiceStats.invoiced, cls: "soft-gold" },
        { label: "可开票金额", value: project.invoiceStats.available, cls: "soft-green" },
        { label: "已回款金额", value: project.invoiceStats.collected, cls: "soft-cyan" },
        { label: "已开票未回款金额", value: project.invoiceStats.uncollected, cls: "soft-red" },
      ],
      true
    )}
    <div class="tab-card">
      <div class="tabs">
        <button class="tab-btn ${state.tabs.invoice === "invoice" ? "active" : ""}" type="button" data-tab-group="invoice" data-tab="invoice">开票记录</button>
        <button class="tab-btn ${state.tabs.invoice === "collection" ? "active" : ""}" type="button" data-tab-group="invoice" data-tab="collection">回款记录</button>
      </div>
      <div class="tab-panel ${state.tabs.invoice === "invoice" ? "" : "hidden"}">
        ${pageTable({
          key: "invoice-table",
          title: "开票列表",
          desc: "仅展示审批通过并完成财务办理的开票数据。",
          toolbarLeft: `${inputControl("搜索开票编号 / 客户名称 / 备注")}${dateRangeControl()}${selectControl(["发票类型", "增值税专用发票", "增值税普通发票"])}`,
          toolbarRight: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button>`,
          rows: project.invoiceRecords,
          columns: [
            { title: "开票编号", width: "12%", render: (row) => `<div class="table-main">${row.code}</div>` },
            { title: "纳税人识别号", width: "14%", render: (row) => row.taxNo },
            { title: "开票日期", width: "10%", render: (row) => row.date },
            { title: "本次开票金额", width: "12%", render: (row) => `<div class="table-main">${row.amount}</div>` },
            { title: "税额", width: "10%", render: (row) => row.tax },
            { title: "发票类型", width: "12%", render: (row) => statusTag(row.type, row.typeTone) },
            { title: "开票内容", width: "12%", render: (row) => row.content },
            { title: "发票备注信息", width: "12%", render: (row) => `<div>${row.remark}</div>` },
            { title: "操作", width: "6%", render: (row) => actionLink("详情", "invoice-detail", row.id) },
          ],
        })}
      </div>
      <div class="tab-panel ${state.tabs.invoice === "collection" ? "" : "hidden"}">
        ${pageTable({
          key: "collection-table",
          title: "回款列表",
          desc: "回款登记不走审批，直接在业务页面登记并保留回单附件。",
          toolbarLeft: `${inputControl("搜索回款编号 / 备注")}${dateRangeControl()}${selectControl(["回款方式", "银行转账", "现金", "承兑", "其他"])}`,
          toolbarRight: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button><button class="btn primary" type="button" data-action="collection-add-modal">新增回款</button>`,
          rows: project.collectionRecords,
          columns: [
            { title: "回款编号", width: "16%", render: (row) => `<div class="table-main">${row.code}</div>` },
            { title: "回款日期", width: "12%", render: (row) => row.date },
            { title: "回款金额", width: "12%", render: (row) => `<div class="table-main">${row.amount}</div>` },
            { title: "回款方式", width: "12%", render: (row) => row.method },
            { title: "备注", width: "30%", render: (row) => `<div>${row.remark}</div><div class="table-sub">${row.account}</div>` },
            { title: "操作", width: "18%", render: (row) => `<div class="actions">${actionLink("详情", "collection-detail", row.id)}${divider()}${actionLink("编辑", "collection-add-modal", row.id)}${divider()}${actionLink("删除", "delete-generic", row.id, 'data-name="回款记录"')}</div>` },
          ],
        })}
      </div>
    </div>`
  );
}

function renderRevenuePage() {
  const project = getProject();
  return pageLayout(
    "收入确认",
    "与合同收入确认节点绑定，审批通过后节点状态更新并进入正式列表。",
    `<div class="toolbar">
      <div class="toolbar-left">${projectSwitch(project)}</div>
      <div class="toolbar-right">
        <button class="btn primary" type="button" data-action="revenue-apply-modal">发起收入确认申请</button>
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-head">
        <p class="summary-title">项目信息</p>
        <span class="summary-tip">已完成节点显示绿色勾选，避免重复发起</span>
      </div>
      <div class="summary-grid">
        <div class="summary-item"><div class="summary-item-label">客户经理</div><div class="summary-item-value">${project.accountManager}</div></div>
        <div class="summary-item"><div class="summary-item-label">项目经理</div><div class="summary-item-value">${project.projectManager}</div></div>
        <div class="summary-item"><div class="summary-item-label">客户名称</div><div class="summary-item-value">${project.customer}</div></div>
        <div class="summary-item"><div class="summary-item-label">合同名称</div><div class="summary-item-value">${project.contractName}</div></div>
        <div class="summary-item"><div class="summary-item-label">合同金额</div><div class="summary-item-value">${project.contractAmount}</div></div>
        <div class="summary-item"><div class="summary-item-label">合同签订日期</div><div class="summary-item-value">${project.contractSignDate}</div></div>
        <div class="summary-item span-full"><div class="summary-item-label">收入确认节点</div><div class="summary-item-value">${renderTerms(project.revenueTerms)}</div></div>
      </div>
    </div>
    ${renderStats([
      { label: "合同金额", value: project.revenueStats.contract, note: "来自项目合同主数据", cls: "soft-blue" },
      { label: "已确认收入金额", value: project.revenueStats.confirmed, note: "审批通过的收入确认金额汇总", cls: "soft-gold" },
      { label: "已确认收入比例", value: project.revenueStats.ratio, note: "勾选并完成确认的节点比例汇总", cls: "soft-green" },
      { label: "剩余待确认金额", value: project.revenueStats.pending, note: "待后续节点完成后再进入确认", cls: "soft-purple" },
    ])}
    <div class="section-card">
      ${pageTable({
        key: "revenue-table",
        title: "收入确认列表",
        desc: "仅展示收入确认申请审批通过的数据。",
        toolbarLeft: `${inputControl("搜索节点说明 / 备注")}${dateRangeControl()}${selectControl(["是否取得验收单", "全部", "是", "否"])}`,
        toolbarRight: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button>`,
        rows: project.revenueRecords,
        columns: [
          { title: "收入确认节点", width: "22%", render: (row) => `<div class="table-main">${row.node}</div>` },
          { title: "比例", width: "10%", render: (row) => row.ratio },
          { title: "金额", width: "14%", render: (row) => `<div class="table-main">${row.amount}</div>` },
          { title: "日期", width: "12%", render: (row) => row.date },
          { title: "是否取得验收单", width: "14%", render: (row) => statusTag(row.acceptance, row.acceptanceTone) },
          { title: "备注", width: "20%", render: (row) => row.remark },
          { title: "操作", width: "8%", render: (row) => actionLink("详情", "revenue-detail", row.id) },
        ],
      })}
    </div>`
  );
}

function renderCostBars(project) {
  return `<div class="bar-stack">${project.expenseBars
    .map(
      (item) => `<div class="bar-row">
        <div class="bar-row-head">
          <div class="bar-label">${item.label}</div>
          <div class="bar-meta"><span>${item.amount}</span><span>${item.percent}</span></div>
        </div>
        <div class="bar-track"><div class="bar-fill ${item.tone}" style="width:${item.width}"></div></div>
      </div>`
    )
    .join("")}</div>`;
}

function parseCurrency(text) {
  return Number(String(text ?? "").replace(/[^\d.-]/g, "")) || 0;
}

function parseHours(text) {
  return Number(String(text ?? "").replace(/[^\d.-]/g, "")) || 0;
}

function formatShortCurrency(value) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  return `${value}`;
}

function getExpenseTotals(project) {
  return project.expenseSummary.reduce(
    (acc, item) => {
      acc.amount += parseCurrency(item.expenseAmount);
      acc.cost += parseCurrency(item.costAmount);
      acc.count += Number(item.expenseCount);
      acc.advance += Number(item.advanceCount);
      return acc;
    },
    { amount: 0, cost: 0, count: 0, advance: 0 }
  );
}

function getDepartmentHours(project) {
  const deptMap = new Map();
  project.laborRows.forEach((item) => {
    const current = deptMap.get(item.dept) ?? { name: item.dept, hours: 0, amount: 0 };
    current.hours += parseHours(item.projectHours);
    current.amount += parseCurrency(item.laborCost);
    deptMap.set(item.dept, current);
  });
  const list = Array.from(deptMap.values())
    .map((item) => ({
      ...item,
      id: item.name,
      unitCost: item.hours ? Math.round(item.amount / item.hours) : 0,
      hoursText: `${item.hours}h`,
      unitCostText: `¥ ${item.hours ? Math.round(item.amount / item.hours) : 0}/h`,
      amountText: `¥ ${item.amount.toLocaleString("zh-CN")}`,
    }))
    .sort((a, b) => b.amount - a.amount);
  const totalAmount = list.reduce((sum, item) => sum + item.amount, 0);
  return list.map((item) => ({
    ...item,
    ratio: totalAmount ? `${((item.amount / totalAmount) * 100).toFixed(1)}%` : "0%",
  }));
}

function renderCostPage() {
  const project = getProject();
  const expenseTotal = getExpenseTotals(project);
  const supplierPaid = project.supplierCosts.reduce((sum, item) => sum + parseCurrency(item.paidAmount), 0);
  const supplierTicket = project.supplierCosts.reduce((sum, item) => sum + parseCurrency(item.ticketAmount), 0);
  const departmentHours = getDepartmentHours(project);
  return `<div class="page-card cost-page-shell">
    <div class="cost-stage">
      <div class="cost-overview-card">
        <div class="cost-overview-head">
          <h1 class="page-title cost-overview-page-title">成本费用</h1>
          <div class="cost-overview-actions">
            ${projectSwitch(project)}
          </div>
        </div>
        <div class="cost-project-band">
          <div class="cost-band-item"><div class="cost-band-label">客户名称</div><div class="cost-band-value">${project.customer}</div></div>
          <div class="cost-band-item"><div class="cost-band-label">合同名称</div><div class="cost-band-value">${project.contractName}</div></div>
          <div class="cost-band-item"><div class="cost-band-label">客户经理</div><div class="cost-band-value">${project.accountManager}</div></div>
          <div class="cost-band-item"><div class="cost-band-label">回款申请进度</div><div class="cost-band-value">${project.paymentTerms.filter((item) => item.done).length}/${project.paymentTerms.length} 已完成</div></div>
        </div>
        <div class="cost-split-grid">
          <div class="cost-split-card primary">
            <div class="cost-band-label">项目成本总额</div>
            <div class="cost-band-value">${project.costStats.total}</div>
            <div class="cost-split-note">合同金额 ${project.contractAmount}</div>
          </div>
          <div class="cost-split-card">
            <div class="cost-band-label">供应商成本</div>
            <div class="cost-band-value">${project.costStats.supplier}</div>
          </div>
          <div class="cost-split-card">
            <div class="cost-band-label">报销成本</div>
            <div class="cost-band-value">${project.costStats.expense}</div>
            <div class="cost-split-note">共 ${expenseTotal.count} 笔报销</div>
          </div>
          <div class="cost-split-card">
            <div class="cost-band-label">人力成本</div>
            <div class="cost-band-value">${project.costStats.labor}</div>
            <div class="cost-split-note">成本占比 ${project.costStats.ratio}</div>
          </div>
        </div>
      </div>

      <div class="cost-block">
        <div class="cost-block-header">
          <div>
            <h2 class="cost-block-title">供应商成本</h2>
          </div>
        </div>
        <div class="cost-insight-grid">
          <div class="cost-insight-card">
            <div class="cost-insight-label">供应商成本总额</div>
            <div class="cost-insight-value">${project.costStats.supplier}</div>
          </div>
          <div class="cost-insight-card">
            <div class="cost-insight-label">成本收票金额</div>
            <div class="cost-insight-value">¥ ${supplierTicket.toLocaleString("zh-CN")}</div>
          </div>
          <div class="cost-insight-card">
            <div class="cost-insight-label">已支付金额</div>
            <div class="cost-insight-value">¥ ${supplierPaid.toLocaleString("zh-CN")}</div>
          </div>
        </div>
        ${pageTable({
          key: "supplier-cost-table",
          title: "供应商成本列表",
          desc: "仅展示采购合同审批通过后进入成本口径的数据，状态统一按支付状态展示。",
          toolbarLeft: `${inputControl("搜索供应商名称")}${dateRangeControl()}${selectControl(["支付状态", "待支付", "部分支付", "已支付"])}`,
          toolbarRight: `<button class="btn primary" type="button">查询</button>`,
          rows: project.supplierCosts,
          columns: [
            { title: "采购合同编号", width: "11%", render: (row) => `<div class="table-main">${row.contractCode}</div>` },
            { title: "项目名称", width: "14%", render: (row) => row.projectName },
            { title: "供应商名称", width: "14%", render: (row) => row.supplier },
            { title: "成本合同金额", width: "10%", render: (row) => row.contractAmount },
            { title: "成本收票金额", width: "10%", render: (row) => row.ticketAmount },
            { title: "已支付", width: "9%", render: (row) => row.paidAmount },
            { title: "待支付", width: "9%", render: (row) => row.unpaidAmount },
            { title: "欠票金额", width: "9%", render: (row) => row.unticketedAmount },
            { title: "支付状态", width: "8%", render: (row) => statusTag(row.status, row.statusTone) },
            { title: "操作", width: "12%", render: (row) => `<div class="actions">${actionLink("上传发票", "supplier-upload-invoice", row.id)}${divider()}${actionLink("详情", "supplier-cost-detail", row.id)}</div>` },
          ],
        })}
      </div>
      
      <div class="cost-block">
        <div class="cost-block-header">
          <div>
            <h2 class="cost-block-title">报销成本</h2>
          </div>
        </div>
        <div class="reimbursement-stage">
          <div class="reimbursement-visual">
            <div class="reimbursement-summary">
              <div class="reimbursement-summary-card"><span>项目报销口径</span><strong>${project.costStats.expense}</strong></div>
              <div class="reimbursement-summary-card"><span>费用类型数</span><strong>${project.expenseBars.length} 类</strong></div>
            </div>
            <div class="cost-chart-shell">
              <div class="cost-chart-head">
                <div>
                  <h3 class="cost-chart-title">报销费用分布</h3>
                </div>
                <span class="tiny-tag gold">报销费用</span>
              </div>
              ${renderCostBars(project)}
            </div>
          </div>
          <div class="cost-chart-shell">
            <div class="cost-chart-head">
              <div>
                <h3 class="cost-chart-title">报销费用明细</h3>
              </div>
              <span class="tiny-tag red">报销明细</span>
            </div>
        ${pageTable({
          key: "expense-summary-table",
          title: "报销费用汇总",
          desc: "仅展示报销审批通过后进入成本口径的数据。",
          toolbarLeft: `${dateRangeControl()}${selectControl(["费用类型", "差旅费", "交通费", "住宿费", "业务招待费", "办公费", "其他"])}`,
          toolbarRight: `<button class="btn primary" type="button">查询</button>`,
          rows: project.expenseSummary,
          columns: [
            { title: "报销人", width: "14%", render: (row) => `<div class="table-main">${row.user}</div>` },
            { title: "部门", width: "16%", render: (row) => row.dept },
            { title: "报销金额", width: "16%", render: (row) => row.expenseAmount },
            { title: "成本金额", width: "16%", render: (row) => row.costAmount },
            { title: "报销笔数", width: "12%", render: (row) => row.expenseCount },
            { title: "借款笔数", width: "12%", render: (row) => row.advanceCount },
            { title: "操作", width: "14%", render: (row) => actionLink("详情", "expense-detail", row.id) },
          ],
        })}
          </div>
        </div>
      </div>

      <div class="cost-block">
        <div class="cost-block-header">
          <div>
            <h2 class="cost-block-title">人力成本</h2>
          </div>
        </div>
        <div class="reimbursement-stage">
          <div class="cost-chart-shell">
            <div class="cost-chart-head">
              <div>
                <h3 class="cost-chart-title">按月份人工成本</h3>
              </div>
              <span class="tiny-tag blue">按月份</span>
            </div>
            <div class="echart-stage tall" id="cost-month-chart"></div>
          </div>
          <div class="cost-chart-shell">
            <div class="cost-chart-head">
              <div>
                <h3 class="cost-chart-title">按部门成本统计</h3>
              </div>
              <span class="tiny-tag cyan">按部门</span>
            </div>
            <div class="labor-dept-layout">
              <div class="labor-dept-chart">
                <div class="echart-stage compact" id="cost-dept-chart"></div>
              </div>
              <div class="labor-dept-table">
                ${pageTable({
                  key: "labor-dept-table",
                  pageSize: 5,
                  rows: departmentHours,
                  columns: [
                    { title: "参与部门", width: "34%", render: (row) => `<div class="table-main">${row.name}</div>` },
                    { title: "工时", width: "18%", render: (row) => row.hoursText },
                    { title: "成本金额", width: "28%", render: (row) => row.amountText },
                    { title: "占比", width: "20%", render: (row) => row.ratio },
                  ],
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function disposeCharts() {
  activeCharts.forEach((chart) => {
    try {
      chart.dispose();
    } catch (error) {
      console.warn(error);
    }
  });
  activeCharts = [];
}

function initCostCharts() {
  disposeCharts();
  if (state.activePage !== "cost" || !window.echarts) return;

  const project = getProject();
  const monthEl = document.getElementById("cost-month-chart");
  const deptEl = document.getElementById("cost-dept-chart");
  if (!monthEl || !deptEl) return;

  const monthChart = window.echarts.init(monthEl);
  const deptChart = window.echarts.init(deptEl);
  const monthData = project.laborTrend.map((item) => ({
    month: item.month,
    amount: parseCurrency(item.amount),
    hours: item.hours,
    headcount: item.headcount,
  }));
  const deptData = getDepartmentHours(project);
  const totalDeptCost = deptData.reduce((sum, item) => sum + item.amount, 0);

  monthChart.setOption({
    animationDuration: 900,
    animationEasing: "quarticOut",
    grid: { left: 20, right: 20, top: 26, bottom: 26, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(15, 23, 42, 0.92)",
      borderWidth: 0,
      textStyle: { color: "#fff" },
      formatter: (params) => {
        const item = monthData[params[0].dataIndex];
        return `${item.month}<br/>人工成本：¥ ${item.amount.toLocaleString("zh-CN")}<br/>工时：${item.hours}<br/>参与人数：${item.headcount}`;
      },
    },
    xAxis: {
      type: "category",
      data: monthData.map((item) => item.month),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      axisLabel: { color: "rgba(22,32,51,0.62)" },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: "#eef2f7", type: "dashed" } },
      axisLabel: {
        color: "rgba(22,32,51,0.46)",
        formatter: (value) => `${Math.round(value / 1000)}k`,
      },
    },
    series: [
      {
        type: "bar",
        barWidth: 30,
        data: monthData.map((item, index) => ({
          value: item.amount,
          itemStyle: {
            borderRadius: [14, 14, 6, 6],
            color: [
              new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#0f7bff" },
                { offset: 1, color: "#72b6ff" },
              ]),
              new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#2db97f" },
                { offset: 1, color: "#8dddb6" },
              ]),
              new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#f0a300" },
                { offset: 1, color: "#ffd36b" },
              ]),
              new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#ff6a4d" },
                { offset: 1, color: "#ffb199" },
              ]),
            ][index % 4],
          },
        })),
      },
    ],
  });

  deptChart.setOption({
    animationDuration: 900,
    animationEasing: "quarticOut",
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(15, 23, 42, 0.92)",
      borderWidth: 0,
      textStyle: { color: "#fff" },
      formatter: ({ name, value, percent }) => `${name}<br/>成本金额：¥ ${value.toLocaleString("zh-CN")}<br/>工时：${deptData.find((item) => item.name === name)?.hoursText ?? "-"}<br/>占比：${percent}%`,
    },
    legend: {
      bottom: 0,
      left: "center",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: "rgba(22,32,51,0.62)", fontSize: 12 },
    },
    series: [
      {
        type: "pie",
        radius: ["44%", "72%"],
        center: ["50%", "44%"],
        padAngle: 2,
        itemStyle: {
          borderWidth: 4,
          borderColor: "#fff",
        },
        label: {
          color: "rgba(22,32,51,0.72)",
          formatter: ({ name, percent }) => `${name}\n${percent}%`,
        },
        data: deptData.map((item, index) => ({
          name: item.name,
          value: item.amount,
          itemStyle: {
            color: ["#1677ff", "#17b26a", "#f79009", "#f04438", "#7a5af8"][index % 5],
          },
        })),
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "37%",
        style: {
          text: "部门成本",
          fill: "rgba(22,32,51,0.52)",
          font: "12px PingFang SC, Microsoft YaHei, sans-serif",
          textAlign: "center",
        },
      },
      {
        type: "text",
        left: "center",
        top: "44%",
        style: {
          text: `¥ ${formatShortCurrency(totalDeptCost)}`,
          fill: "rgba(22,32,51,0.92)",
          font: "700 26px PingFang SC, Microsoft YaHei, sans-serif",
          textAlign: "center",
        },
      },
    ],
  });

  activeCharts = [monthChart, deptChart];
  window.requestAnimationFrame(() => {
    monthChart.resize();
    deptChart.resize();
  });
}

function resizeCharts() {
  activeCharts.forEach((chart) => {
    try {
      chart.resize();
    } catch (error) {
      console.warn(error);
    }
  });
}

function simpleListPage({ title, desc, filters, actions, table }) {
  return pageLayout(
    title,
    desc,
    `<div class="section-card">
      ${pageTable({
        ...table,
        toolbarLeft: filters,
        toolbarRight: actions,
      })}
    </div>`
  );
}

function renderPaymentManagementPage() {
  return simpleListPage({
    title: "支付管理",
    desc: "承接付款申请审批通过后的实际支付操作，状态列统一使用支付状态，支持分次支付和支付明细追溯。",
    filters: `${inputControl("项目名称")}${inputControl("合同编号")}${inputControl("供应商名称")}${selectControl(["支付状态", "全部", "待支付", "部分支付", "已支付"])}`,
    actions: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button>`,
    table: {
      key: "payment-management-table",
      title: "付款申请支付列表",
      desc: "页面仅展示付款申请审批已通过的数据。",
      rows: paymentManagementData,
      columns: [
        { title: "付款申请单号", width: "12%", render: (row) => `<div class="table-main">${row.code}</div>` },
        { title: "项目名称", width: "14%", render: (row) => row.projectName },
        { title: "合同编号", width: "12%", render: (row) => row.contractCode },
        { title: "供应商名称", width: "14%", render: (row) => row.supplier },
        { title: "申请金额", width: "10%", render: (row) => row.requestAmount },
        { title: "付款账户", width: "14%", render: (row) => `<div>${row.account}</div>` },
        { title: "已支付", width: "8%", render: (row) => row.paidAmount },
        { title: "未支付", width: "8%", render: (row) => row.unpaidAmount },
        { title: "支付状态", width: "8%", render: (row) => statusTag(row.status, row.statusTone) },
        { title: "操作", width: "18%", render: (row) => `<div class="actions">${row.status !== "已支付" ? `${actionLink("支付", "payment-do", row.id)}${divider()}` : ""}${row.history.length ? `${actionLink("支付明细", "payment-detail", row.id)}${divider()}` : ""}${actionLink("详情", "payment-request-detail", row.id)}</div>` },
      ],
    },
  });
}

function renderCustomersPage() {
  return simpleListPage({
    title: "客户管理",
    desc: "统一维护客户基础资料，页面仅保留新增、筛选与表格列表。",
    filters: `${inputControl("客户名称")}${inputControl("纳税人识别号")}`,
    actions: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button><button class="btn primary" type="button" data-action="customer-create">新增客户</button>`,
    table: {
      key: "customer-table",
      title: "客户列表",
      desc: "列表字段与客户选择组件取数口径一致，支持后续合同管理直接复用。",
      rows: customersData,
      columns: [
        { title: "客户编号", width: "10%", render: (row) => `<div class="table-main">${row.code}</div>` },
        { title: "客户名称", width: "14%", render: (row) => `<div class="table-main">${row.name}</div><div class="table-sub">创建人：${row.createdBy} ｜ 已关联合同 ${row.contractCount} 份</div>` },
        { title: "纳税人识别号", width: "13%", render: (row) => row.taxId || "待补充" },
        { title: "企业地址", width: "16%", render: (row) => row.address || "待补充" },
        { title: "企业电话", width: "10%", render: (row) => row.phone || "待补充" },
        { title: "开户银行", width: "12%", render: (row) => row.bankName || "待补充" },
        { title: "银行账户", width: "12%", render: (row) => row.bankAccount || "待补充" },
        { title: "创建时间", width: "8%", render: (row) => row.createdAt },
        { title: "操作", width: "12%", render: (row) => `<div class="actions">${actionLink("编辑", "customer-edit", row.id)}${divider()}${actionLink("删除", "customer-delete", row.id)}</div>` },
      ],
    },
  });
}

function renderSuppliersPage() {
  return simpleListPage({
    title: "供应商管理",
    desc: "维护统一供应商库，支持产品清单与采购历史追溯，供采购申请、采购合同与付款申请自动带出。",
    filters: `${inputControl("公司名称")}${selectControl(["税务类型", "一般纳税人", "小规模纳税人"])}${inputControl("联系人")}`,
    actions: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button><button class="btn primary" type="button" data-action="supplier-create">新增供应商</button>`,
    table: {
      key: "supplier-master-table",
      title: "供应商列表",
      desc: "超过 3 个操作时应折叠到更多菜单，这里以高保真原型方式完整展示。",
      rows: suppliersData,
      columns: [
        { title: "序号", width: "6%", render: (row) => suppliersData.findIndex((item) => item.id === row.id) + 1 },
        { title: "公司名称", width: "18%", render: (row) => `<div class="table-main">${row.name}</div>` },
        { title: "税号", width: "15%", render: (row) => row.taxNo },
        { title: "联系人", width: "10%", render: (row) => row.contact },
        { title: "联系方式", width: "12%", render: (row) => row.phone },
        { title: "税务类型", width: "10%", render: (row) => row.taxType },
        { title: "产品数", width: "8%", render: (row) => row.productCount },
        { title: "更新时间", width: "11%", render: (row) => row.updatedAt },
        { title: "操作", width: "20%", render: (row) => `<div class="actions">${actionLink("采购历史", "supplier-history", row.id)}${divider()}${actionLink("产品清单", "supplier-products", row.id)}${divider()}${actionLink("编辑", "supplier-edit", row.id)}${divider()}${actionLink("删除", "delete-generic", row.id, 'data-name="供应商"')}</div>` },
      ],
    },
  });
}

function renderSupplierHistoryPage() {
  const supplier = getSupplier();
  return pageLayout(
    `${supplier.name} - 采购历史`,
    "从供应商列表进入的二级页面，按采购合同明细拆行展示，采购历史只读不可编辑。",
    `<div class="section-card">
      <div class="section-head">
        <div class="back-link" data-action="back-suppliers">← 返回供应商列表</div>
      </div>
      ${pageTable({
        key: "supplier-history-table",
        title: "采购历史",
        desc: "数据粒度为“一条产品一条记录”，仅采购合同用印审批通过后写入。",
        toolbarLeft: `${inputControl("采购合同编号")}${inputControl("项目名称")}${inputControl("产品名称")}${dateRangeControl()}`,
        toolbarRight: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button>`,
        rows: supplier.history,
        columns: [
          { title: "采购合同编号", width: "12%", render: (row) => `<div class="table-main">${row.contractCode}</div>` },
          { title: "项目名称", width: "16%", render: (row) => row.projectName },
          { title: "产品名称", width: "14%", render: (row) => row.productName },
          { title: "规格型号", width: "12%", render: (row) => row.spec },
          { title: "数量", width: "8%", render: (row) => row.qty },
          { title: "单价", width: "10%", render: (row) => row.price },
          { title: "单位", width: "8%", render: (row) => row.unit },
          { title: "合计金额", width: "10%", render: (row) => row.amount },
          { title: "签订日期", width: "10%", render: (row) => row.date },
        ],
      })}
    </div>`
  );
}

function renderPlansPage() {
  return simpleListPage({
    title: "采购计划",
    desc: "状态列统一使用审批状态；审批通过后可作为采购申请来源单据，明细支持类别、说明、预算和自动汇总。",
    filters: `${selectControl(["项目", "全部项目", ...financeProjects.map((item) => item.name)])}${selectControl(["采购类别", "设备采购", "软件采购", "服务采购", "材料采购", "办公采购", "行政采购", "其他"])}${selectControl(["审批状态", "草稿", "审批中", "已通过", "已拒绝", "已撤回"])}${inputControl("计划单号 / 采购事由")}`,
    actions: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button><button class="btn primary" type="button" data-action="plan-create">发起采购计划</button>`,
    table: {
      key: "plan-table",
      title: "采购计划列表",
      desc: "明细表预算自动汇总为“合计预算”，不可手填。",
      rows: plansData,
      columns: [
        { title: "计划单号", width: "12%", render: (row) => `<div class="table-main">${row.code}</div>` },
        { title: "项目名称", width: "16%", render: (row) => row.projectName },
        { title: "采购事由", width: "18%", render: (row) => row.reason },
        { title: "采购类别摘要", width: "14%", render: (row) => row.categories },
        { title: "合计预算", width: "10%", render: (row) => row.budget },
        { title: "是否比选", width: "8%", render: (row) => statusTag(row.bidFlag, row.bidTone) },
        { title: "审批状态", width: "10%", render: (row) => statusTag(row.status, row.statusTone) },
        { title: "申请人", width: "6%", render: (row) => row.applicant },
        { title: "申请日期", width: "10%", render: (row) => row.date },
        { title: "操作", width: "6%", render: (row) => actionLink("详情", "plan-detail", row.id) },
      ],
    },
  });
}

function renderRequestsPage() {
  return simpleListPage({
    title: "采购申请",
    desc: "根据“是否需要比价”决定后续流程和明细填写方式，状态列统一使用审批状态；不需要比价时商品必须来自供应商产品清单。",
    filters: `${selectControl(["项目", "全部项目", ...financeProjects.map((item) => item.name)])}${selectControl(["采购类别", "设备采购", "软件采购", "服务采购", "材料采购", "行政采购"])}${selectControl(["是否需要比价", "全部", "是", "否"])}${selectControl(["审批状态", "草稿", "审批中", "已通过", "已拒绝", "已撤回"])}${inputControl("申请单号 / 采购事由")}`,
    actions: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button><button class="btn primary" type="button" data-action="request-create">发起采购申请</button>`,
    table: {
      key: "request-table",
      title: "采购申请列表",
      desc: "审批通过后才可继续关联比价询价或采购合同。",
      rows: requestsData,
      columns: [
        { title: "申请单号", width: "12%", render: (row) => `<div class="table-main">${row.code}</div>` },
        { title: "项目名称", width: "14%", render: (row) => row.projectName },
        { title: "采购事由", width: "18%", render: (row) => row.reason },
        { title: "采购类别", width: "10%", render: (row) => row.category },
        { title: "是否需要比价", width: "10%", render: (row) => statusTag(row.needInquiry, row.inquiryTone) },
        { title: "供应商", width: "12%", render: (row) => row.supplier },
        { title: "合计金额", width: "10%", render: (row) => row.amount },
        { title: "审批状态", width: "8%", render: (row) => statusTag(row.status, row.statusTone) },
        { title: "申请人", width: "6%", render: (row) => row.applicant },
        { title: "申请日期", width: "10%", render: (row) => row.date },
        { title: "操作", width: "6%", render: (row) => actionLink("详情", "request-detail", row.id) },
      ],
    },
  });
}

function renderInquiriesPage() {
  return simpleListPage({
    title: "比价询价",
    desc: "以“比选流程”为主线展示数据，状态跟随比选与确定供应商两个审批流程联动。",
    filters: `${selectControl(["项目", "全部项目", ...financeProjects.map((item) => item.name)])}${selectControl(["比价询价状态", "全部", "待审核", "待确认供应商", "确认供应商待审核", "已确定供应商"])}${inputControl("比选单号 / 采购申请单号")}`,
    actions: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button><button class="btn primary" type="button" data-action="inquiry-create">发起比选</button>`,
    table: {
      key: "inquiry-table",
      title: "比价询价列表",
      desc: "一条比选只能发起一次确定供应商流程，确定后才能进入采购合同签订。",
      rows: inquiriesData,
      columns: [
        { title: "比选单号", width: "12%", render: (row) => `<div class="table-main">${row.code}</div>` },
        { title: "项目名称", width: "14%", render: (row) => row.projectName },
        { title: "关联采购申请", width: "12%", render: (row) => row.requestCode },
        { title: "采购标的摘要", width: "16%", render: (row) => row.target },
        { title: "比价询价状态", width: "14%", render: (row) => statusTag(row.status, row.statusTone) },
        { title: "确定供应商", width: "14%", render: (row) => row.supplier },
        { title: "合计金额", width: "10%", render: (row) => row.amount },
        { title: "发起人", width: "8%", render: (row) => row.applicant },
        { title: "发起日期", width: "10%", render: (row) => row.date },
        { title: "操作", width: "14%", render: (row) => `<div class="actions">${actionLink("详情", "inquiry-detail", row.id)}${row.status === "待确认供应商" ? `${divider()}${actionLink("确定供应商", "inquiry-confirm", row.id)}` : ""}</div>` },
      ],
    },
  });
}

function renderContractsPage() {
  return simpleListPage({
    title: "采购合同签订",
    desc: "从“比价已确定供应商”或“直采采购申请”选择采购对象，带出信息后可修改并生成合同文件；状态列统一使用审批状态。",
    filters: `${selectControl(["项目", "全部项目", ...financeProjects.map((item) => item.name)])}${inputControl("供应商名称")}${selectControl(["审批状态", "草稿", "审批中", "已通过", "已拒绝", "已撤回"])}${inputControl("合同编号 / 合同名称")}`,
    actions: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button><button class="btn primary" type="button" data-action="contract-create">新增合同</button>`,
    table: {
      key: "contract-table",
      title: "采购合同列表",
      desc: "合同审批通过后，已有供应商会同步写入采购历史，并可继续发起付款申请。",
      rows: contractsData,
      columns: [
        { title: "合同编号", width: "12%", render: (row) => `<div class="table-main">${row.code}</div>` },
        { title: "项目名称", width: "16%", render: (row) => row.projectName },
        { title: "供应商名称", width: "16%", render: (row) => row.supplier },
        { title: "来源类型", width: "10%", render: (row) => statusTag(row.sourceType, row.sourceTone) },
        { title: "合计金额", width: "10%", render: (row) => row.amount },
        { title: "合同份数", width: "8%", render: (row) => row.copies },
        { title: "审批状态", width: "10%", render: (row) => statusTag(row.status, row.statusTone) },
        { title: "创建日期", width: "10%", render: (row) => row.date },
        { title: "操作", width: "18%", render: (row) => `<div class="actions">${actionLink("详情", "contract-detail", row.id)}${divider()}${actionLink("下载合同", "download-generic", row.id, 'data-name="采购合同"')}${row.status === "已通过" ? `${divider()}${actionLink("付款申请", "contract-payment-request", row.id)}` : ""}</div>` },
      ],
    },
  });
}

function renderPaymentRequestsPage() {
  return simpleListPage({
    title: "付款申请",
    desc: "对已签订采购合同发起付款审批，状态列统一使用审批状态；审批通过后流转到财务“支付管理”页面执行实际支付。",
    filters: `${inputControl("采购合同编号")}${inputControl("供应商名称")}${selectControl(["审批状态", "草稿", "审批中", "已通过", "已拒绝", "已撤回"])}${dateRangeControl()}`,
    actions: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button><button class="btn primary" type="button" data-action="payment-request-create">发起付款申请</button>`,
    table: {
      key: "payment-request-table",
      title: "付款申请列表",
      desc: "同一采购合同可发起多次付款申请，但本次付款金额不能超过合同待付金额。",
      rows: paymentRequestsData,
      columns: [
        { title: "付款申请单号", width: "12%", render: (row) => `<div class="table-main">${row.code}</div>` },
        { title: "采购合同编号", width: "12%", render: (row) => row.contractCode },
        { title: "项目名称", width: "14%", render: (row) => row.projectName },
        { title: "供应商名称", width: "14%", render: (row) => row.supplier },
        { title: "合同金额", width: "10%", render: (row) => row.contractAmount },
        { title: "本次付款金额", width: "10%", render: (row) => row.requestAmount },
        { title: "开户银行", width: "12%", render: (row) => row.bank },
        { title: "审批状态", width: "10%", render: (row) => statusTag(row.status, row.statusTone) },
        { title: "申请人", width: "6%", render: (row) => row.applicant },
        { title: "申请日期", width: "10%", render: (row) => row.date },
        { title: "操作", width: "6%", render: (row) => actionLink("详情", "payment-request-detail", row.id) },
      ],
    },
  });
}

function renderStockPage() {
  const currentTab = state.tabs.stock;
  return pageLayout(
    "出入库登记",
    "执行类页面，不走审批、不强绑定采购合同，入库与出库分 Tab 展示与操作。",
    `<div class="tab-card">
      <div class="tabs">
        <button class="tab-btn ${currentTab === "inbound" ? "active" : ""}" type="button" data-tab-group="stock" data-tab="inbound">入库</button>
        <button class="tab-btn ${currentTab === "outbound" ? "active" : ""}" type="button" data-tab-group="stock" data-tab="outbound">出库</button>
      </div>
      <div class="tab-panel ${currentTab === "inbound" ? "" : "hidden"}">
        ${pageTable({
          key: "stock-in-table",
          title: "入库记录",
          desc: "记录物品来源、存放位置、入库人和入库时间。",
          toolbarLeft: `${inputControl("物品名称")}${dateRangeControl()}${inputControl("入库人")}`,
          toolbarRight: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button><button class="btn primary" type="button" data-action="stock-in-create">新增入库</button>`,
          rows: stockInboundData,
          columns: [
            { title: "入库单号", width: "12%", render: (row) => `<div class="table-main">${row.code}</div>` },
            { title: "物品名称", width: "12%", render: (row) => row.name },
            { title: "规格型号", width: "10%", render: (row) => row.spec },
            { title: "单位", width: "8%", render: (row) => row.unit },
            { title: "数量", width: "8%", render: (row) => row.qty },
            { title: "存放位置", width: "12%", render: (row) => row.place },
            { title: "来源说明", width: "16%", render: (row) => row.source },
            { title: "入库人", width: "8%", render: (row) => row.user },
            { title: "入库时间", width: "10%", render: (row) => row.time },
            { title: "备注", width: "10%", render: (row) => row.remark },
            { title: "操作", width: "14%", render: (row) => `<div class="actions">${actionLink("详情", "stock-detail", row.id)}${divider()}${actionLink("编辑", "stock-in-create", row.id)}${divider()}${actionLink("删除", "delete-generic", row.id, 'data-name="入库记录"')}</div>` },
          ],
        })}
      </div>
      <div class="tab-panel ${currentTab === "outbound" ? "" : "hidden"}">
        ${pageTable({
          key: "stock-out-table",
          title: "出库记录",
          desc: "出库需保留领用去向和领用人 / 部门，不走审批。",
          toolbarLeft: `${inputControl("物品名称")}${dateRangeControl()}${inputControl("出库人")}`,
          toolbarRight: `<button class="btn primary" type="button">查询</button><button class="btn" type="button">重置</button><button class="btn primary" type="button" data-action="stock-out-create">新增出库</button>`,
          rows: stockOutboundData,
          columns: [
            { title: "出库单号", width: "12%", render: (row) => `<div class="table-main">${row.code}</div>` },
            { title: "物品名称", width: "12%", render: (row) => row.name },
            { title: "规格型号", width: "10%", render: (row) => row.spec },
            { title: "单位", width: "8%", render: (row) => row.unit },
            { title: "数量", width: "8%", render: (row) => row.qty },
            { title: "领用去向", width: "14%", render: (row) => row.target },
            { title: "领用人/部门", width: "14%", render: (row) => row.owner },
            { title: "出库人", width: "8%", render: (row) => row.user },
            { title: "出库时间", width: "10%", render: (row) => row.time },
            { title: "备注", width: "10%", render: (row) => row.remark },
            { title: "操作", width: "14%", render: (row) => `<div class="actions">${actionLink("详情", "stock-detail", row.id)}${divider()}${actionLink("编辑", "stock-out-create", row.id)}${divider()}${actionLink("删除", "delete-generic", row.id, 'data-name="出库记录"')}</div>` },
          ],
        })}
      </div>
    </div>`
  );
}

function field(label, value, span = 1, multiline = false) {
  return `<div class="form-item ${span > 1 ? `span-${span}` : ""}">
    <span class="form-label">${label}</span>
    <div class="form-value ${multiline ? "multiline" : ""}">${value}</div>
  </div>`;
}

function fakeInput(label, value, span = 1, helper = "") {
  return `<div class="form-item ${span > 1 ? `span-${span}` : ""}">
    <span class="form-label">${label}</span>
    <div class="fake-control">${value}</div>
    ${helper ? `<div class="helper-text">${helper}</div>` : ""}
  </div>`;
}

function fakeTextarea(label, value, span = 2) {
  return `<div class="form-item span-${span}">
    <span class="form-label">${label}</span>
    <div class="form-value multiline">${value}</div>
  </div>`;
}

function fakeUpload(label, text, span = 2) {
  return `<div class="form-item span-${span}">
    <span class="form-label">${label}</span>
    <div class="fake-upload">${text}</div>
  </div>`;
}

function choiceField(label, items, span = 2) {
  return `<div class="form-item span-${span}">
    <span class="form-label">${label}</span>
    <div class="choice-list">${items
      .map(
        (item) => `<div class="choice-item ${item.checked ? "checked" : ""} ${item.disabled ? "disabled" : ""}">
          <span class="choice-dot"></span>
          <span>
            <div class="choice-title">${item.title}</div>
            ${item.meta ? `<div class="choice-meta">${item.meta}</div>` : ""}
          </span>
        </div>`
      )
      .join("")}</div>
  </div>`;
}

function section(title, body) {
  return `<div class="detail-section"><h3 class="detail-section-title">${title}</h3>${body}</div>`;
}

function grid(items, threeCol = false) {
  return `<div class="form-grid ${threeCol ? "three-col" : ""}">${items.join("")}</div>`;
}

function notice(lines) {
  return `<div class="notice">${lines.map((line) => `<p>${line}</p>`).join("")}</div>`;
}

function timeline(items) {
  return `<div class="timeline">${items
    .map(
      (item) => `<div class="timeline-item">
        <div class="timeline-title">${item.title}</div>
        <div class="timeline-meta">${item.meta}</div>
      </div>`
    )
    .join("")}</div>`;
}

function simpleForm(items) {
  return `<div class="form-stack">${items.join("")}</div>`;
}

function approvalHint(text = "该业务提交后走审批表流程，弹窗仅展示审批表字段、明细数据和审批流节点。") {
  return `<div class="notice info"><p>${text}</p></div>`;
}

function specRow(field, source, required, component, note = "") {
  return { field, source, required, component, note };
}

function fieldSpecTable(rows, label = "字段") {
  return `<div class="spec-table-wrap">
    <table class="spec-table">
      <thead>
        <tr>
          <th>${label}</th>
          <th>来源</th>
          <th>是否必填</th>
          <th>组件</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `<tr>
              <td>${row.field}</td>
              <td>${row.source}</td>
              <td>${row.required}</td>
              <td>${row.component}</td>
              <td>${row.note || "-"}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>`;
}

function openModal({ title, subtitle, width = "overlay-panel-960", body, footer }) {
  const pendingTables = overlayTables;
  modalMask.innerHTML = `<div class="overlay-panel ${width}" role="dialog" aria-modal="true">
    <div class="overlay-header">
      <div>
        <h2 class="overlay-title">${title}</h2>
        <p class="overlay-subtitle">${subtitle}</p>
      </div>
      <button class="overlay-close" type="button" data-close="modal">×</button>
    </div>
    <div class="overlay-body">${body}</div>
    <div class="overlay-footer">${footer ?? `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">保存</button>`}</div>
  </div>`;
  modalTables = pendingTables;
  overlayTables = {};
  modalMask.hidden = false;
  renderAllTables(modalTables);
}

function openDrawer({ title, subtitle, body, footer }) {
  const pendingTables = overlayTables;
  drawerMask.innerHTML = `<div class="drawer-panel" role="dialog" aria-modal="true">
    <div class="overlay-header">
      <div>
        <h2 class="overlay-title">${title}</h2>
        <p class="overlay-subtitle">${subtitle}</p>
      </div>
      <button class="overlay-close" type="button" data-close="drawer">×</button>
    </div>
    <div class="overlay-body">${body}</div>
    <div class="overlay-footer">${footer ?? `<button class="btn" type="button" data-close="drawer">关闭</button>`}</div>
  </div>`;
  drawerTables = pendingTables;
  overlayTables = {};
  drawerMask.hidden = false;
  renderAllTables(drawerTables);
}

function closeModal() {
  modalMask.hidden = true;
  modalMask.innerHTML = "";
  modalTables = {};
  overlayTables = {};
}

function closeDrawer() {
  drawerMask.hidden = true;
  drawerMask.innerHTML = "";
  drawerTables = {};
  overlayTables = {};
}

function renderProjectSelector(keyword = "") {
  const lower = keyword.trim().toLowerCase();
  projectOptionList.innerHTML = financeProjects
    .filter((item) => [item.code, item.name, item.customer].some((part) => part.toLowerCase().includes(lower)))
    .map(
      (item) => `<button class="project-option ${item.id === state.pendingProjectId ? "active" : ""}" type="button" data-project-option="${item.id}">
        <span class="project-radio" aria-hidden="true"></span>
        <span class="project-option-content">
          <div class="project-option-name">${item.code} ${item.name}</div>
          <div class="project-option-meta">客户：${item.customer} ｜ 客户经理：${item.accountManager} ｜ 项目经理：${item.projectManager}</div>
        </span>
      </button>`
    )
    .join("");
}

function openProjectModal() {
  state.pendingProjectId = state.currentProjectId;
  projectSearchInput.value = "";
  renderProjectSelector();
  projectMask.hidden = false;
}

function closeProjectModal() {
  projectMask.hidden = true;
}

function updateBreadcrumb() {
  const pageKey = state.activePage === "supplier-history" ? "suppliers" : state.activePage;
  const page = pages[state.activePage];
  const menuPage = pages[pageKey];
  breadcrumbParent.textContent = page.group;
  breadcrumbPage.textContent = page.title ?? menuPage.title;
}

function updateMenu() {
  const activeKey = state.activePage === "supplier-history" ? "suppliers" : state.activePage;
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.classList.toggle("active", button.getAttribute("data-nav") === activeKey);
  });
}

function renderPage() {
  activeTables = {};
  const page = pages[state.activePage];
  screenRoot.innerHTML = page.render();
  if (window.location.hash !== `#${state.activePage}`) {
    window.history.replaceState(null, "", `#${state.activePage}`);
  }
  updateBreadcrumb();
  updateMenu();
  renderAllTables(activeTables);
  if (state.activePage === "cost") {
    initCostCharts();
  } else {
    disposeCharts();
  }
}

function findById(list, id) {
  return list.find((item) => item.id === id);
}

function handleAction(action, rowId, target) {
  const project = getProject();
  const paymentRow = findById(paymentManagementData, rowId) ?? findById(paymentRequestsData, rowId);
  const supplierRow = findById(suppliersData, rowId) ?? findById(project.supplierCosts, rowId);
  const supplierProductParent =
    findById(suppliersData, target?.dataset.supplierId ?? rowId) ??
    suppliersData.find((item) => item.products.some((product) => product.id === rowId));
  const supplierProductRow = supplierProductParent?.products.find((item) => item.id === rowId);
  const customerRow = findById(customersData, rowId);
  const planRow = findById(plansData, rowId);
  const requestRow = findById(requestsData, rowId);
  const inquiryRow = findById(inquiriesData, rowId);
  const contractRow = findById(contractsData, rowId);
  const collectionRow = findById(project.collectionRecords, rowId);
  const invoiceRow = findById(project.invoiceRecords, rowId);
  const revenueRow = findById(project.revenueRecords, rowId);
  const expenseRow = findById(project.expenseSummary, rowId);
  const expenseOrderRow = findById(expenseDetailRows, rowId);
  const advanceOrderRow = findById(advanceDetailRows, rowId);
  const expenseOwnerRow = findById(project.expenseSummary, target?.dataset.expenseOwnerId);
  const laborRow = findById(project.laborRows, rowId);
  const stockRow = findById(stockInboundData, rowId) ?? findById(stockOutboundData, rowId);

  switch (action) {
    case "open-project":
      openProjectModal();
      return;
    case "invoice-request-modal":
      openModal({
        title: "回款申请",
        subtitle: "走审批表，提交后进入回款审批流程。",
        width: "overlay-panel-720",
        body: [
          approvalHint("该新增入口直接按审批表字段定义展示，字段口径与需求文档保持一致。"),
          section("审批表字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "选择交付项目（projectScope: delivery）"),
            specRow("支付条件", "自动带出", "是", "多选复选框", "选择项目后自动带出项目合同的全部支付条件，已完成条件置灰不可再选，可多选"),
            specRow("客户名称", "自动获取", "是", "文本只读", "选择项目后从合同自动带出"),
            specRow("合同金额", "自动获取", "是", "数值只读", "选择项目后从合同自动带出"),
            specRow("本次可回款金额", "自动计算", "是", "数值只读", "等于勾选支付条件对应金额之和，自动计算"),
            specRow("备注", "自填", "否", "多行文本", ""),
          ])),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "审批人：周舟" }, { title: "部门负责人审批", meta: "审批人：刘敏" }, { title: "抄送", meta: "发起人本人" }]))
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">提交审批</button>`,
      });
      return;
    case "invoice-apply-modal":
      openModal({
        title: "开票申请",
        subtitle: "走审批表，提交后进入开票审批流程。",
        width: "overlay-panel-960",
        body: [
          approvalHint("该新增入口直接展示审批表字段定义、默认选项和审批节点。"),
          section("审批表字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "选择交付项目"),
            specRow("支付条件进度", "自动带出", "-", "只读展示", "选择项目后自动带出所有支付条件及完成状态，只读"),
            specRow("可回款金额", "自动带出", "-", "数值只读", "已完成回款申请的支付条件金额之和"),
            specRow("可开票金额", "自动带出", "-", "数值只读", "可回款金额 - 已开票金额"),
            specRow("客户名称（业主）", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("纳税人识别号", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("企业地址", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("企业电话", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("开户银行", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("银行账户", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("合同总金额", "自动获取", "是", "数值只读", "从项目合同获取"),
            specRow("本次开票金额", "自填", "是", "数值输入框", "不能为负数，不能超过可开票金额"),
            specRow("发票类型", "下拉选择", "是", "下拉", "默认选项：增值税专用发票、增值税普通发票"),
            specRow("开票内容", "下拉选择", "是", "下拉", "默认选项：技术服务费、咨询服务费、软件开发费、系统集成服务费、运维服务费、设备款、其他"),
            specRow("发票备注信息", "自填", "否", "多行文本", "补充说明"),
          ])),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "条件审批" }, { title: "财务开票办理", meta: "办理节点，需支持上传发票附件" }, { title: "抄送", meta: "发起人 + 可配置抄送人" }]))
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">提交审批</button>`,
      });
      return;
    case "collection-add-modal":
      openModal({
        title: rowId ? "编辑回款" : "新增回款",
        subtitle: "回款无需审批，直接在业务页面登记并上传回单附件。",
        width: "overlay-panel-720",
        body: section(
          "回款信息",
          simpleForm([
            fakeInput("回款方式", collectionRow?.method ?? "银行转账"),
            fakeInput("回款金额", collectionRow?.amount ?? "¥ 420,000"),
            fakeInput("回款日期", collectionRow?.date ?? "2026-04-08"),
            fakeInput("收款账户", collectionRow?.account ?? "工行成都高新支行 6222 **** 1288"),
            fakeTextarea("回款备注", collectionRow?.remark ?? "客户回款凭证已上传。", 1),
            fakeUpload("回单附件", "点击上传图片或 PDF，支持回款回单 / 银行流水截图", 1),
          ])
        ),
      });
      return;
    case "invoice-detail":
      openDrawer({
        title: `开票详情 - ${invoiceRow.code}`,
        subtitle: "详情直接展示审批表字段定义与审批流程，口径与需求文档保持一致。",
        body: [
          section("审批表字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "选择交付项目"),
            specRow("支付条件进度", "自动带出", "-", "只读展示", "选择项目后自动带出所有支付条件及完成状态，只读"),
            specRow("可回款金额", "自动带出", "-", "数值只读", "已完成回款申请的支付条件金额之和"),
            specRow("可开票金额", "自动带出", "-", "数值只读", "可回款金额 - 已开票金额"),
            specRow("客户名称（业主）", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("纳税人识别号", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("企业地址", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("企业电话", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("开户银行", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("银行账户", "自动带出", "-", "只读展示", "从项目合同关联客户获取"),
            specRow("合同总金额", "自动获取", "是", "数值只读", "从项目合同获取"),
            specRow("本次开票金额", "自填", "是", "数值输入框", "不能为负数，不能超过可开票金额"),
            specRow("发票类型", "下拉选择", "是", "下拉", "默认选项：增值税专用发票、增值税普通发票"),
            specRow("开票内容", "下拉选择", "是", "下拉", "默认选项：技术服务费、咨询服务费、软件开发费、系统集成服务费、运维服务费、设备款、其他"),
            specRow("发票备注信息", "自填", "否", "多行文本", "补充说明"),
          ])),
          section("流程轨迹", timeline([{ title: "发起申请", meta: "张晨 2026-04-02 09:12" }, { title: "直属上级审批通过", meta: "一级审批通过" }, { title: "部门负责人审批通过", meta: "条件审批通过" }, { title: "财务办理完成", meta: "办理节点上传发票附件并完成开票" }, { title: "抄送", meta: "发起人 + 可配置抄送人" }]))
        ].join(""),
      });
      return;
    case "collection-detail":
      openDrawer({
        title: `回款详情 - ${collectionRow.code}`,
        subtitle: "展示回款登记信息、附件和追溯信息。",
        body: [
          section("回款信息", grid([field("回款编号", collectionRow.code), field("回款日期", collectionRow.date), field("回款金额", collectionRow.amount), field("回款方式", collectionRow.method), field("收款账户", collectionRow.account, 2), fakeTextarea("回款备注", collectionRow.remark, 2), fakeUpload("回单附件", "回款回单.pdf / 银行流水截图.png", 2)])),
          section("追溯信息", timeline([{ title: "业务登记", meta: "财务 李倩 2026-04-05 14:18" }, { title: "附件上传", meta: "回单附件已归档，可下载查看" }]))
        ].join(""),
      });
      return;
    case "customer-create":
    case "customer-edit":
      openModal({
        title: action === "customer-create" ? "新增客户" : `编辑客户 - ${customerRow.code}`,
        subtitle: "统一维护客户基础资料，供合同管理、开票申请等场景复用。",
        width: "overlay-panel-720",
        body: [
          section(
            "基础信息",
            simpleForm([
              field("客户编号", customerRow?.code ?? "保存后自动生成"),
              field("创建人", customerRow?.createdBy ?? "默认当前登录人"),
              fakeInput("客户名称", customerRow?.name ?? "请输入客户名称", 1, "必填，最大 200 字符，且名称不可重复"),
              fakeInput("纳税人识别号", customerRow?.taxId ?? "请输入纳税人识别号", 1, "选填，15-20 位字母数字组合"),
              fakeInput("企业电话", customerRow?.phone ?? "请输入企业电话", 1, "最大 50 字符"),
              fakeInput("企业地址", customerRow?.address ?? "请输入企业地址", 1, "最大 500 字符"),
              fakeInput("开户银行", customerRow?.bankName ?? "请输入开户银行", 1, "最大 200 字符"),
              fakeInput("银行账户", customerRow?.bankAccount ?? "请输入银行账户", 1, "最大 100 字符"),
              fakeTextarea("备注", customerRow?.remark ?? "请输入备注，最多 500 字符。", 1),
            ])
          ),
          section("联动说明", notice(["保存成功后可直接出现在客户选择组件中。", "若合同已关联当前客户，修改后应同步影响合同详情中的开票信息展示。"]))
        ].join(""),
      });
      return;
    case "customer-selector-preview": {
      const previewCustomer = customerRow ?? customersData[0];
      openModal({
        title: "客户选择组件预览",
        subtitle: "模拟合同管理中下拉选择客户、预览开票资料以及快捷新增客户的完整流程。",
        width: "overlay-panel-960",
        body: [
          section(
            "组件能力",
            grid([
              fakeInput("客户", `${previewCustomer.code} ${previewCustomer.name}`, 2, "支持按客户名称 / 编号搜索"),
              field("下拉接口", "/api/project/customers/options", 2),
              fakeInput("新增客户快捷入口", "下拉末尾展示“新增客户”", 2, "点击后打开 720px 新增客户弹窗，保存后自动选中新客户"),
            ])
          ),
          section(
            "客户选项",
            overlayTable({
              key: "customer-options-preview",
              rows: customersData,
              columns: [
                { title: "客户编号", render: (row) => row.code },
                { title: "客户名称", render: (row) => `<div class="table-main">${row.name}</div>` },
                { title: "纳税人识别号", render: (row) => row.taxId || "待补充" },
                { title: "开票资料", render: (row) => statusTag(hasCustomerBillingProfile(row) ? "完整" : "待补齐", hasCustomerBillingProfile(row) ? "green" : "gold") },
                { title: "合同关联", render: (row) => `${row.contractCount} 份` },
              ],
            })
          ),
          section(
            "选中客户后自动带出",
            grid([
              field("客户名称", previewCustomer.name),
              field("纳税人识别号", previewCustomer.taxId || "待补充"),
              field("企业电话", previewCustomer.phone || "待补充"),
              field("开户银行", previewCustomer.bankName || "待补充"),
              field("银行账户", previewCustomer.bankAccount || "待补充"),
              fakeTextarea("企业地址", previewCustomer.address || "待补充", 2),
            ])
          ),
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-action="customer-create" data-close="modal">快捷新增客户</button>`,
      });
      return;
    }
    case "customer-delete":
      if (customerRow?.contractCount) {
        openModal({
          title: "删除客户",
          subtitle: "已被合同关联的客户不可删除，需先解除业务引用。",
          width: "overlay-panel-720",
          body: section(
            "删除限制",
            notice([
              `客户“${customerRow.name}”已被 ${customerRow.contractCount} 份合同关联，无法删除。`,
              `关联合同：${customerRow.linkedContracts.join("、")}`,
              "若需停用，建议在正式系统中增加“停用”状态，而不是直接物理删除。",
            ])
          ),
          footer: `<button class="btn primary" type="button" data-close="modal">我知道了</button>`,
        });
        return;
      }

      openModal({
        title: "删除客户",
        subtitle: "删除前需二次确认，原型中仅展示校验与确认逻辑。",
        width: "overlay-panel-720",
        body: section(
          "确认删除",
          notice([
            `确认删除客户“${customerRow?.name ?? ""}”吗？`,
            "真实业务中调用删除接口前，仍需再次校验是否存在合同引用。",
          ])
        ),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">确认删除</button>`,
      });
      return;
    case "revenue-apply-modal":
      openModal({
        title: "收入确认申请",
        subtitle: "走审批表，提交后进入收入确认审批流程。",
        width: "overlay-panel-720",
        body: [
          approvalHint("该新增入口直接按收入确认申请审批表字段定义展示。"),
          section("审批表字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "选择交付项目（projectScope: delivery）"),
            specRow("收入确认节点", "自动带出", "是", "多选复选框", "选择项目后自动带出全部收入确认节点，已完成节点置灰不可再选，可多选"),
            specRow("收入确认比例", "自动计算", "是", "数值只读", "等于勾选节点的比例之和"),
            specRow("收入确认金额", "自动计算", "是", "数值只读", "等于勾选节点的金额之和"),
            specRow("收入确认日期", "自填", "是", "日期选择", ""),
            specRow("是否取得验收单", "选择", "是", "单选", "是/否"),
            specRow("附件上传", "上传", "否", "上传组件", "验收单等附件"),
            specRow("备注", "自填", "否", "多行文本", ""),
          ])),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "审批人：陈澈" }, { title: "部门负责人审批", meta: "审批人：周舟" }, { title: "财务负责人审批", meta: "审批人：李倩" }, { title: "抄送", meta: "发起人本人" }]))
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">提交审批</button>`,
      });
      return;
    case "revenue-detail":
      openDrawer({
        title: `收入确认详情 - ${revenueRow.id}`,
        subtitle: "详情直接展示收入确认审批表字段定义与审批流程。",
        body: [
          section("审批表字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "选择交付项目（projectScope: delivery）"),
            specRow("收入确认节点", "自动带出", "是", "多选复选框", "选择项目后自动带出全部收入确认节点，已完成节点置灰不可再选，可多选"),
            specRow("收入确认比例", "自动计算", "是", "数值只读", "等于勾选节点的比例之和"),
            specRow("收入确认金额", "自动计算", "是", "数值只读", "等于勾选节点的金额之和"),
            specRow("收入确认日期", "自填", "是", "日期选择", ""),
            specRow("是否取得验收单", "选择", "是", "单选", "是/否"),
            specRow("附件上传", "上传", "否", "上传组件", "验收单等附件"),
            specRow("备注", "自填", "否", "多行文本", ""),
          ])),
          section("流程轨迹", timeline([{ title: "发起申请", meta: "张晨 2026-04-03 09:20" }, { title: "直属上级审批通过", meta: "周舟 2026-04-03 10:15" }, { title: "部门负责人审批通过", meta: "刘敏 2026-04-03 10:36" }, { title: "财务负责人审批通过", meta: "李倩 2026-04-03 11:00" }]))
        ].join(""),
      });
      return;
    case "supplier-upload-invoice":
      openModal({
        title: "上传发票",
        subtitle: "供应商费用页面中的收票入口，展示 OCR 识别、人工确认和最终成本金额。",
        width: "overlay-panel-960",
        body: [
          section("识别提示", notice(["若发票为专票，成本金额取不含税金额。", "若发票为普票，成本金额取价税合计金额。"])),
          section(
            "收票信息",
            grid([
              field("采购合同编号", supplierRow.contractCode),
              field("供应商名称", supplierRow.supplier),
              fakeUpload("原始发票附件", "上传图片 / PDF，支持 OCR 识别", 2),
              field("OCR 识别结果", `发票类型：增值税专用发票 ｜ 价税合计：${supplierRow.ticketAmount}` , 2),
              field("人工确认结果", `税额：¥ 51,600 ｜ 最终成本金额：${supplierRow.ticketAmount}`, 2),
              fakeTextarea("备注", "人工确认 OCR 结果无误后入账。", 2),
            ])
          ),
        ].join(""),
      });
      return;
    case "supplier-cost-detail":
      openDrawer({
        title: `供应商成本详情 - ${supplierRow.contractCode}`,
        subtitle: "按需求文档展示采购合同信息、收票记录、发票上传记录和支付记录。",
        body: [
          section(
            "采购合同信息",
            [
              fieldSpecTable([
                specRow("采购合同编号", "采购合同", "是", "文本只读", "合同编号"),
                specRow("项目名称", "采购合同", "是", "文本只读", "关联的交付项目"),
                specRow("供应商名称", "采购合同", "是", "文本只读", "供应商公司名称"),
                specRow("成本合同金额", "采购合同", "是", "数值只读", "采购合同的合计金额"),
                specRow("签订日期", "采购合同", "是", "日期只读", "合同签订日期"),
                specRow("合同状态", "采购合同", "是", "状态只读", "采购合同状态"),
              ]),
              overlayTable({
                key: `supplier-contract-products-${supplierRow.id}`,
                rows: [
                  { id: "1", name: "边缘采集网关", qty: "12", price: "¥ 16,800", amount: "¥ 201,600" },
                  { id: "2", name: "安装调试服务", qty: "1", price: "¥ 280,000", amount: "¥ 280,000" },
                  { id: "3", name: "接口实施服务", qty: "2", price: "¥ 42,000", amount: "¥ 84,000" },
                ],
                columns: [
                  { title: "商品名称", render: (row) => row.name },
                  { title: "数量", render: (row) => row.qty },
                  { title: "单价", render: (row) => row.price },
                  { title: "金额", render: (row) => row.amount },
                ],
              }),
            ].join("")
          ),
          section(
            "收票记录",
            overlayTable({
              key: `supplier-ticket-records-${supplierRow.id}`,
              rows: [
                { id: "1", invoiceNo: "044001900211", type: "专票", total: "¥ 1,260,000", net: "¥ 1,108,000", tax: "¥ 152,000", cost: supplierRow.ticketAmount, date: "2026-04-08" },
                { id: "2", invoiceNo: "044001900233", type: "普票", total: "¥ 180,000", net: "-", tax: "-", cost: "¥ 180,000", date: "2026-04-11" },
              ],
              columns: [
                { title: "发票编号", render: (row) => row.invoiceNo },
                { title: "发票类型", render: (row) => row.type },
                { title: "价税合计", render: (row) => row.total },
                { title: "不含税金额", render: (row) => row.net },
                { title: "税额", render: (row) => row.tax },
                { title: "成本金额", render: (row) => row.cost },
                { title: "收票日期", render: (row) => row.date },
                { title: "操作", render: () => actionLink("查看发票", "download-generic", supplierRow.id, 'data-name="发票附件"') },
              ],
            })
          ),
          section(
            "发票上传记录",
            overlayTable({
              key: `supplier-upload-records-${supplierRow.id}`,
              rows: [
                { id: "1", time: "2026-04-08 10:12", user: "张晨", invoiceNo: "044001900211", type: "专票", amount: "¥ 1,260,000", cost: supplierRow.ticketAmount, file: "invoice-001.pdf", status: "已识别" },
                { id: "2", time: "2026-04-11 15:46", user: "张晨", invoiceNo: "044001900233", type: "普票", amount: "¥ 180,000", cost: "¥ 180,000", file: "invoice-002.pdf", status: "人工录入" },
              ],
              columns: [
                { title: "上传时间", render: (row) => row.time },
                { title: "上传人", render: (row) => row.user },
                { title: "发票编号", render: (row) => row.invoiceNo },
                { title: "发票类型", render: (row) => row.type },
                { title: "发票金额", render: (row) => row.amount },
                { title: "成本金额", render: (row) => row.cost },
                { title: "发票附件", render: (row) => actionLink(row.file, "download-generic", supplierRow.id, 'data-name="发票附件"') },
                { title: "OCR 识别状态", render: (row) => row.status },
              ],
            })
          ),
          section(
            "支付记录",
            overlayTable({
              key: `supplier-pay-records-${supplierRow.id}`,
              rows: [
                { id: "1", code: "ZF-202604-001", requestCode: "FKSQ-202604-001", amount: "¥ 220,000", method: "银行转账", date: "2026-04-08", operator: "李倩", remark: "首笔支付" },
                { id: "2", code: "ZF-202604-004", requestCode: "FKSQ-202604-001", amount: "¥ 200,000", method: "银行转账", date: "2026-04-10", operator: "李倩", remark: "第二次支付" },
                { id: "3", code: "ZF-202604-006", requestCode: "FKSQ-202604-001", amount: "¥ 180,000", method: "承兑", date: "2026-04-13", operator: "李倩", remark: "承兑支付" },
              ],
              columns: [
                { title: "支付编号", render: (row) => row.code },
                { title: "付款申请号", render: (row) => row.requestCode },
                { title: "支付金额", render: (row) => row.amount },
                { title: "支付方式", render: (row) => row.method },
                { title: "支付日期", render: (row) => row.date },
                { title: "操作人", render: (row) => row.operator },
                { title: "备注", render: (row) => row.remark },
              ],
            })
          ),
        ].join(""),
      });
      return;
    case "supplier-ticket-detail":
      openDrawer({
        title: `收票详情 - ${supplierRow.contractCode}`,
        subtitle: "展示原始附件、OCR 识别结果、人工修正结果和最终成本金额。",
        body: [
          section("合同与收票", grid([field("采购合同编号", supplierRow.contractCode), field("供应商名称", supplierRow.supplier), field("成本合同金额", supplierRow.contractAmount), field("成本收票金额", supplierRow.ticketAmount), field("欠票金额", supplierRow.unticketedAmount), field("状态", supplierRow.status)])),
          section("附件与识别", notice(["原始发票附件：invoice-001.pdf", "OCR 识别结果：专票 / 价税合计 1,260,000 / 税额 152,000", "人工确认后最终成本金额：1,108,000"])),
        ].join(""),
      });
      return;
    case "supplier-pay-detail":
      openDrawer({
        title: `支付详情 - ${supplierRow.contractCode}`,
        subtitle: "支付状态联动支付管理，已支付和待支付字段实时更新。",
        body: [
          section("支付汇总", grid([field("采购合同编号", supplierRow.contractCode), field("供应商名称", supplierRow.supplier), field("已支付", supplierRow.paidAmount), field("待支付", supplierRow.unpaidAmount), field("状态", supplierRow.status), field("欠票金额", supplierRow.unticketedAmount)])),
          section(
            "历次支付记录",
            overlayTable({
              key: `pay-history-${supplierRow.id}`,
              rows: [
                { id: "1", code: "ZF-202604-001", amount: "¥ 220,000", method: "银行转账", date: "2026-04-08", operator: "李倩", remark: "首笔支付" },
                { id: "2", code: "ZF-202604-004", amount: "¥ 200,000", method: "银行转账", date: "2026-04-10", operator: "李倩", remark: "二次支付" },
                { id: "3", code: "ZF-202604-006", amount: "¥ 180,000", method: "承兑", date: "2026-04-13", operator: "李倩", remark: "承兑支付" },
                { id: "4", code: "ZF-202604-008", amount: "¥ 0", method: "其他", date: "2026-04-15", operator: "李倩", remark: "分页占位" },
                { id: "5", code: "ZF-202604-010", amount: "¥ 0", method: "其他", date: "2026-04-16", operator: "李倩", remark: "分页占位" },
                { id: "6", code: "ZF-202604-012", amount: "¥ 0", method: "其他", date: "2026-04-17", operator: "李倩", remark: "分页占位" },
              ],
              columns: [
                { title: "支付编号", render: (row) => row.code },
                { title: "支付金额", render: (row) => row.amount },
                { title: "支付方式", render: (row) => row.method },
                { title: "支付日期", render: (row) => row.date },
                { title: "操作人", render: (row) => row.operator },
                { title: "备注", render: (row) => row.remark },
              ],
            })
          ),
        ].join(""),
      });
      return;
    case "expense-detail":
      openDrawer({
        title: `${expenseRow.user} - 报销费用详情`,
        subtitle: "按报销单分组展示报销明细，并展示当前项目下的借款信息。",
        body: [
          section("汇总信息", grid([field("报销人", expenseRow.user), field("所属部门", expenseRow.dept), field("报销总额", expenseRow.expenseAmount), field("成本金额", expenseRow.costAmount), field("报销笔数", expenseRow.expenseCount), field("借款笔数", expenseRow.advanceCount)])),
          section(
            "报销单明细",
            overlayTable({
              key: `expense-detail-${expenseRow.id}`,
              rows: expenseDetailRows,
              columns: [
                { title: "报销单号", render: (row) => row.code },
                { title: "报销事由", render: (row) => row.reason },
                { title: "报销类型", render: (row) => row.type },
                { title: "申请日期", render: (row) => row.date },
                { title: "费用汇总额", render: (row) => row.total },
                { title: "关联审批单", render: (row) => row.approve },
                { title: "是否含专票", render: (row) => row.invoice },
                { title: "操作", render: (row) => actionLink("详情", "expense-approval-detail", row.id, `data-expense-owner-id="${expenseRow.id}"`) },
              ],
            })
          ),
          section(
            "借款信息",
            overlayTable({
              key: `advance-detail-${expenseRow.id}`,
              rows: advanceDetailRows,
              columns: [
                { title: "借款单号", render: (row) => row.code },
                { title: "借款金额", render: (row) => row.amount },
                { title: "借款日期", render: (row) => row.date },
                { title: "借款状态", render: (row) => row.status },
                { title: "备注", render: (row) => row.remark },
                { title: "操作", render: (row) => actionLink("详情", "advance-approval-detail", row.id, `data-expense-owner-id="${expenseRow.id}"`) },
              ],
            })
          ),
        ].join(""),
      });
      return;
    case "expense-approval-detail":
      openDrawer({
        title: `审批表详情 - ${expenseOrderRow.code}`,
        subtitle: "报销单详情直接展示审批表字段定义与审批流程。",
        body: [
          section("报销审批表字段", fieldSpecTable([
            specRow("报销人", "默认值", "是", "用户默认值组件", "默认当前登录人"),
            specRow("所属部门", "默认值", "是", "部门默认值组件", "默认当前用户部门"),
            specRow("选择项目", "自主选择", "条件必填", "项目选择组件", "报销类型为项目报销时必填"),
            specRow("报销事由", "自填", "是", "多行文本", ""),
            specRow("报销明细", "自填", "是", "明细表格", "见下方报销明细表字段"),
            specRow("费用汇总额", "自动生成", "是", "计算组件", "汇总明细金额"),
            specRow("关联审批单", "自主选择", "否", "关联审批表组件", "关联出差、招待、用车等"),
            specRow("是否含专票", "下拉选择", "否", "单选", "是/否"),
            specRow("附件上传", "上传", "是", "发票识别组件", "支持多张发票"),
            specRow("备注", "自填", "否", "多行文本", ""),
          ])),
          section("报销明细表字段", fieldSpecTable([
            specRow("报销类别", "-", "-", "-", ""),
            specRow("单项报销金额", "-", "-", "-", ""),
            specRow("费用详情", "-", "-", "-", ""),
            specRow("单据张数", "-", "-", "-", ""),
            specRow("发票张数", "-", "-", "-", ""),
            specRow("是否专票", "-", "-", "-", ""),
            specRow("税额", "-", "-", "-", ""),
            specRow("入账金额", "-", "-", "-", ""),
          ], "列名")),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "财务负责人审批", meta: "条件审批" }, { title: "出纳 / 财务办理", meta: "办理节点" }, { title: "抄送", meta: "申请人" }]))
        ].join(""),
      });
      return;
    case "advance-approval-detail":
      openDrawer({
        title: `审批表详情 - ${advanceOrderRow.code}`,
        subtitle: "借款详情直接展示借款申请字段定义与审批流程。",
        body: [
          section("借款申请字段", fieldSpecTable([
            specRow("借款人", "自动获取", "是", "文本只读", "默认当前申请人"),
            specRow("所属部门", "自动获取", "是", "文本只读", "根据申请人自动带出"),
            specRow("选择项目", "自主选择", "条件必填", "项目选择组件", "项目类借款必填，日常借款可不选"),
            specRow("项目编号", "自动获取", "否", "文本只读", "选择项目后自动带出"),
            specRow("申请事由", "自填", "是", "多行文本", "说明借款用途"),
            specRow("申请金额", "自填", "是", "数值输入框", "借款金额"),
            specRow("收款账户", "自主选择", "是", "收款账户组件", "选择个人已维护的收款信息"),
            specRow("预计归还日期", "自填", "否", "日期组件", "可为空，用于财务跟踪"),
            specRow("备注", "自填", "否", "多行文本", "补充说明"),
          ])),
          section("审批流程", timeline([{ title: "借款人发起", meta: "提交借款申请" }, { title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "部门分管负责人 / 财务负责人审批", meta: "条件审批" }, { title: "出纳打款", meta: "办理节点" }, { title: "抄送", meta: "申请人及相关知会人员" }]))
        ].join(""),
      });
      return;
    case "labor-detail":
      openDrawer({
        title: `${laborRow.name} - 人工成本详情`,
        subtitle: "展示工时、单位工时成本和项目人工成本结果，不暴露工资原始数据。",
        body: [
          section("人工成本信息", grid([field("员工姓名", laborRow.name), field("所属部门", laborRow.dept), field("岗位", laborRow.role), field("月份", laborRow.month), field("项目工时", laborRow.projectHours), field("单位工时成本", laborRow.unitCost), field("人工成本", laborRow.laborCost)])),
          section("说明", notice(["单位工时成本 = 月度人工总成本 / 员工当月总工时。", "页面仅展示项目分摊结果和可公开字段。"]))
        ].join(""),
      });
      return;
    case "payment-do":
      openModal({
        title: `支付 - ${paymentRow.code}`,
        subtitle: "一笔付款申请可分多次支付，本次支付金额不能超过剩余待支付金额。",
        width: "overlay-panel-720",
        body: section(
          "支付信息",
          grid([
            field("付款申请单号", paymentRow.code),
            field("申请金额", paymentRow.requestAmount),
            field("已支付金额", paymentRow.paidAmount),
            field("剩余待支付", paymentRow.unpaidAmount),
            fakeInput("本次支付金额", paymentRow.unpaidAmount, 1, "超过剩余待支付金额时需红色预警"),
            fakeInput("支付方式", "银行转账"),
            fakeInput("支付日期", "2026-04-16"),
            fakeUpload("支付凭证", "上传支付回单、付款凭证等附件", 2),
            fakeTextarea("备注", "第二次支付，覆盖合同节点二。", 2),
          ])
        ),
      });
      return;
    case "payment-detail":
      openDrawer({
        title: `支付明细 - ${paymentRow.code}`,
        subtitle: "支付明细为只读记录，不支持修改和删除。",
        body: section(
          "历次支付记录",
          overlayTable({
            key: `payment-detail-${paymentRow.id}`,
            rows: paymentRow.history,
            columns: [
              { title: "支付编号", render: (row) => row.id },
              { title: "支付金额", render: (row) => row.amount },
              { title: "支付方式", render: (row) => row.method },
              { title: "支付日期", render: (row) => row.date },
              { title: "支付凭证", render: (row) => `<span class="inline-file">${row.voucher}</span>` },
              { title: "操作人", render: (row) => row.operator },
              { title: "操作时间", render: (row) => row.time },
              { title: "备注", render: (row) => row.remark },
            ],
          })
        ),
      });
      return;
    case "supplier-create":
    case "supplier-edit":
      openModal({
        title: action === "supplier-create" ? "新增供应商" : `编辑供应商 - ${supplierRow.name}`,
        subtitle: "供应商主数据用于采购申请、采购合同和付款申请自动带出。",
        width: "overlay-panel-960",
        body: section(
          "供应商信息",
          grid([
            fakeInput("公司名称", supplierRow?.name ?? "请输入供应商全称"),
            fakeInput("税号", supplierRow?.taxNo ?? "请输入统一社会信用代码"),
            fakeInput("联系人", supplierRow?.contact ?? "请输入联系人"),
            fakeInput("联系方式", supplierRow?.phone ?? "请输入联系方式"),
            fakeInput("税务类型", supplierRow?.taxType ?? "一般纳税人"),
            fakeInput("地址", supplierRow?.address ?? "请输入地址"),
            fakeInput("开户银行", supplierRow?.bank ?? "请输入开户银行"),
            fakeInput("银行账户", supplierRow?.account ?? "请输入银行账户"),
            fakeTextarea("备注", supplierRow?.remark ?? "供应商合作情况说明。", 2),
          ])
        ),
      });
      return;
    case "supplier-products":
      openDrawer({
        title: `产品清单 - ${supplierRow.name}`,
        subtitle: "采购申请中选择该供应商后，明细表商品从此产品清单中选择并自动带出规格型号、单价、单位。",
        body: section(
          "产品清单",
          `<div class="detail-actions"><button class="btn primary" type="button" data-action="supplier-product-create" data-row-id="${supplierRow.id}" data-supplier-id="${supplierRow.id}">新增产品</button></div>${overlayTable({
            key: `supplier-products-${supplierRow.id}`,
            rows: supplierRow.products,
            columns: [
              { title: "产品/服务名称", render: (row) => row.name },
              { title: "规格型号", render: (row) => row.spec },
              { title: "单位", render: (row) => row.unit },
              { title: "参考单价", render: (row) => row.price },
              { title: "备注", render: (row) => row.remark },
              { title: "操作", render: (row) => `<div class="actions">${actionLink("编辑", "supplier-product-edit", row.id, `data-supplier-id="${supplierRow.id}"`)}${divider()}${actionLink("删除", "delete-generic", row.id, 'data-name="产品条目"')}</div>` },
            ],
          })}`
        ),
        footer: `<button class="btn" type="button" data-close="drawer">关闭</button>`,
      });
      return;
    case "supplier-product-create":
    case "supplier-product-edit":
      openModal({
        title: action === "supplier-product-create" ? `新增产品 - ${supplierProductParent?.name ?? supplierRow?.name ?? "供应商"}` : `编辑产品 - ${supplierProductRow?.name ?? ""}`,
        subtitle: "维护供应商产品清单后，采购申请可直接选择产品并带出规格、单位和参考单价。",
        width: "overlay-panel-720",
        body: section(
          "产品信息",
          simpleForm([
            field("所属供应商", supplierProductParent?.name ?? supplierRow?.name ?? "-"),
            fakeInput("产品/服务名称", supplierProductRow?.name ?? "请输入产品或服务名称"),
            fakeInput("规格型号", supplierProductRow?.spec ?? "请输入规格型号"),
            fakeInput("单位", supplierProductRow?.unit ?? "请输入单位"),
            fakeInput("参考单价", supplierProductRow?.price ?? "请输入参考单价"),
            fakeTextarea("备注", supplierProductRow?.remark ?? "可填写适用场景、价格说明等。", 1),
          ])
        ),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">保存</button>`,
      });
      return;
    case "supplier-history":
      state.activeSupplierId = rowId;
      state.activePage = "supplier-history";
      renderPage();
      return;
    case "back-suppliers":
      state.activePage = "suppliers";
      renderPage();
      return;
    case "plan-create":
      openModal({
        title: "发起采购计划",
        subtitle: "走审批表，提交后进入采购计划审批流程。",
        width: "overlay-panel-1200",
        body: [
          approvalHint("该新增入口直接按采购计划审批表字段定义展示。"),
          section("表头字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "交付项目"),
            specRow("采购事由", "自填", "是", "多行文本", ""),
            specRow("是否比选", "选择", "是", "单选", "是/否，标记后续是否需要走比选流程"),
            specRow("备注", "自填", "否", "多行文本", ""),
            specRow("附件", "上传", "否", "上传组件", "支持 Word/PDF"),
          ])),
          section("明细表字段", fieldSpecTable([
            specRow("采购类别", "-", "是", "下拉选择", "默认选项：设备采购、软件采购、服务采购、材料采购、办公采购、行政采购、其他"),
            specRow("说明", "-", "否", "输入框", "对该类别采购内容的说明"),
            specRow("预算", "-", "是", "数值输入", "该类别预算金额，保留两位小数"),
            specRow("合计预算", "自动计算", "-", "数值只读", "各行预算金额之和，只读"),
          ], "列名")),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "分管副总审批", meta: "条件审批" }, { title: "采购专员办理", meta: "办理节点" }, { title: "抄送", meta: "发起人 / 项目负责人" }])),
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">提交审批</button>`,
      });
      return;
    case "plan-detail":
      openDrawer({
        title: `采购计划详情 - ${planRow.code}`,
        subtitle: "详情直接展示采购计划审批表字段定义与审批流程。",
        body: [
          section("表头字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "交付项目"),
            specRow("采购事由", "自填", "是", "多行文本", ""),
            specRow("是否比选", "选择", "是", "单选", "是/否，标记后续是否需要走比选流程"),
            specRow("备注", "自填", "否", "多行文本", ""),
            specRow("附件", "上传", "否", "上传组件", "支持 Word/PDF"),
          ])),
          section("明细表字段", fieldSpecTable([
            specRow("采购类别", "-", "是", "下拉选择", "默认选项：设备采购、软件采购、服务采购、材料采购、办公采购、行政采购、其他"),
            specRow("说明", "-", "否", "输入框", "对该类别采购内容的说明"),
            specRow("预算", "-", "是", "数值输入", "该类别预算金额，保留两位小数"),
            specRow("合计预算", "自动计算", "-", "数值只读", "各行预算金额之和，只读"),
          ], "列名")),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "分管副总审批", meta: "条件审批" }, { title: "采购专员办理", meta: "办理节点" }, { title: "抄送", meta: "发起人 / 项目负责人" }]))
        ].join(""),
      });
      return;
    case "request-create":
      openModal({
        title: "发起采购申请",
        subtitle: "走审批表，提交后进入采购申请审批流程。",
        width: "overlay-panel-1200",
        body: [
          approvalHint("该新增入口直接展示采购申请审批表字段定义，不同模式拆分展示。"),
          section("表头字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "交付项目"),
            specRow("关联采购计划", "自主选择", "否", "关联审批表组件", "仅可选已通过采购计划"),
            specRow("采购事由", "自填", "是", "多行文本", ""),
            specRow("采购类别", "下拉选择", "是", "下拉", "与采购计划统一"),
            specRow("是否需要比价", "选择", "是", "单选", "决定明细表填写方式和后续流程"),
            specRow("关联供应商", "自主选择", "条件必填", "供应商选择组件", "仅当“不需要比价”时显示且必填"),
            specRow("备注", "自填", "否", "多行文本", ""),
            specRow("附件", "上传", "否", "上传组件", "支持 Word/PDF/图片"),
          ])),
          section("明细表字段 - 不需要比价", fieldSpecTable([
            specRow("商品名称", "供应商产品库", "是", "下拉选择", "从关联供应商产品清单中选择，仅可选已有产品"),
            specRow("规格型号", "自动带出", "-", "文本只读", "选择商品后自动带出"),
            specRow("单价", "自动带出", "-", "数值只读", "选择商品后自动带出参考单价"),
            specRow("单位", "自动带出", "-", "文本只读", "选择商品后自动带出"),
            specRow("数量", "自填", "是", "数值输入框", "用户填写"),
            specRow("小计金额", "自动计算", "-", "数值只读", "数量 x 单价，自动计算"),
          ], "列名")),
          section("明细表字段 - 需要比价", fieldSpecTable([
            specRow("商品名称", "自填", "是", "输入框", "手动输入"),
            specRow("规格型号", "自填", "否", "输入框", "手动输入"),
            specRow("单价", "自填", "否", "数值输入框", "可为空，待比价确定"),
            specRow("单位", "自填", "是", "输入框", "手动输入"),
            specRow("数量", "自填", "是", "数值输入框", ""),
            specRow("小计金额", "自填", "否", "数值输入框", "未确定单价时可为空"),
          ], "列名")),
          section("明细后通用字段", fieldSpecTable([
            specRow("合计金额", "自填", "是", "数值输入框", "手动填写合计金额"),
            specRow("支付节点", "自填", "否", "自增表格", "类似合同支付节点"),
            specRow("交货验收", "自填", "否", "多行文本", "交货验收条款"),
            specRow("权责与违约", "自填", "否", "多行文本", "权责划分与违约责任条款"),
            specRow("附则", "自填", "否", "多行文本", "补充条款"),
          ])),
          section("支付节点表字段", fieldSpecTable([
            specRow("节点说明", "-", "是", "输入框", "如“合同签订后”“验收通过后”"),
            specRow("比例", "-", "是", "数值输入框", "百分比，如 30"),
            specRow("金额", "-", "否", "数值输入框", "可手填或按合计金额 x 比例计算"),
          ], "列名")),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "部门分管副总审批", meta: "三级审批" }, { title: "总经办副总审批", meta: "四级审批（职能）" }, { title: "总经理审批", meta: "五级审批" }, { title: "采购专员办理", meta: "办理节点" }, { title: "抄送", meta: "可配置" }])),
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">提交审批</button>`,
      });
      return;
    case "request-detail":
      openDrawer({
        title: `采购申请详情 - ${requestRow.code}`,
        subtitle: "详情直接展示采购申请审批表字段定义与审批流程。",
        body: [
          section("表头字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "交付项目"),
            specRow("关联采购计划", "自主选择", "否", "关联审批表组件", "仅可选已通过采购计划"),
            specRow("采购事由", "自填", "是", "多行文本", ""),
            specRow("采购类别", "下拉选择", "是", "下拉", "与采购计划统一"),
            specRow("是否需要比价", "选择", "是", "单选", "决定明细表填写方式和后续流程"),
            specRow("关联供应商", "自主选择", "条件必填", "供应商选择组件", "仅当“不需要比价”时显示且必填"),
            specRow("备注", "自填", "否", "多行文本", ""),
            specRow("附件", "上传", "否", "上传组件", "支持 Word/PDF/图片"),
          ])),
          section("明细表字段 - 不需要比价", fieldSpecTable([
            specRow("商品名称", "供应商产品库", "是", "下拉选择", "从关联供应商产品清单中选择，仅可选已有产品"),
            specRow("规格型号", "自动带出", "-", "文本只读", "选择商品后自动带出"),
            specRow("单价", "自动带出", "-", "数值只读", "选择商品后自动带出参考单价"),
            specRow("单位", "自动带出", "-", "文本只读", "选择商品后自动带出"),
            specRow("数量", "自填", "是", "数值输入框", "用户填写"),
            specRow("小计金额", "自动计算", "-", "数值只读", "数量 x 单价，自动计算"),
          ], "列名")),
          section("明细表字段 - 需要比价", fieldSpecTable([
            specRow("商品名称", "自填", "是", "输入框", "手动输入"),
            specRow("规格型号", "自填", "否", "输入框", "手动输入"),
            specRow("单价", "自填", "否", "数值输入框", "可为空，待比价确定"),
            specRow("单位", "自填", "是", "输入框", "手动输入"),
            specRow("数量", "自填", "是", "数值输入框", ""),
            specRow("小计金额", "自填", "否", "数值输入框", "未确定单价时可为空"),
          ], "列名")),
          section("明细后通用字段", fieldSpecTable([
            specRow("合计金额", "自填", "是", "数值输入框", "手动填写合计金额"),
            specRow("支付节点", "自填", "否", "自增表格", "类似合同支付节点"),
            specRow("交货验收", "自填", "否", "多行文本", "交货验收条款"),
            specRow("权责与违约", "自填", "否", "多行文本", "权责划分与违约责任条款"),
            specRow("附则", "自填", "否", "多行文本", "补充条款"),
          ])),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "部门分管副总审批", meta: "三级审批" }, { title: "总经办副总审批", meta: "四级审批（职能）" }, { title: "总经理审批", meta: "五级审批" }, { title: "采购专员办理", meta: "办理节点" }, { title: "抄送", meta: "可配置" }]))
        ].join(""),
      });
      return;
    case "inquiry-create":
      openModal({
        title: "发起比选",
        subtitle: "走审批表，提交后进入比选审批流程。",
        width: "overlay-panel-1200",
        body: [
          approvalHint("该新增入口直接按比选审批表字段定义展示。"),
          section("表单字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "交付项目"),
            specRow("选择采购申请", "自主选择", "是", "关联审批表组件", "仅可选“已通过”且“需要比价”的采购申请"),
            specRow("采购标的", "自动带出", "-", "明细表只读", "选择采购申请后自动带出采购明细，仅供参考不可编辑"),
            specRow("支付节点", "自填/自动带出", "否", "自增表格", "若采购申请中已填则自动带出，可修改"),
            specRow("交货验收", "自填/自动带出", "否", "多行文本", "若采购申请中已填则自动带出，可修改"),
            specRow("权责与违约", "自填/自动带出", "否", "多行文本", "若采购申请中已填则自动带出，可修改"),
            specRow("附则", "自填/自动带出", "否", "多行文本", "若采购申请中已填则自动带出，可修改"),
          ])),
          section("支付节点表字段", fieldSpecTable([
            specRow("节点说明", "-", "是", "输入框", "如“合同签订后”“验收通过后”"),
            specRow("比例", "-", "是", "数值输入框", "百分比"),
            specRow("金额", "-", "否", "数值输入框", "可手填或按比例计算"),
          ], "列名")),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "抄送", meta: "发起人" }])),
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">提交审批</button>`,
      });
      return;
    case "inquiry-confirm":
      openModal({
        title: "确定供应商",
        subtitle: "走审批表，提交后进入确定供应商审批流程。",
        width: "overlay-panel-1200",
        body: [
          approvalHint("确定供应商按文档分“基础字段 / 已有供应商模式 / 新供应商模式 / 通用条款字段”展示。"),
          section("基础字段", fieldSpecTable([
            specRow("选择比选", "自主选择", "是", "关联审批表组件", "仅可选“待确认供应商”的比选单据"),
            specRow("说明", "自填", "是", "多行文本", "说明最终决定选择哪个供应商的理由"),
            specRow("附件", "上传", "否", "上传组件", "支持多个附件，供应商回函/报价文件"),
            specRow("是否新供应商", "选择", "是", "单选", "是/否，决定后续字段展示逻辑"),
          ])),
          section("已有供应商模式（是否新供应商 = 否）", fieldSpecTable([
            specRow("选择供应商", "自主选择", "是", "供应商选择组件", "从供应商库中选择已有供应商"),
            specRow("采购明细", "自填", "是", "明细表格", "见下方已有供应商采购明细表"),
          ])),
          section("已有供应商采购明细表", fieldSpecTable([
            specRow("商品名称", "供应商产品库", "是", "下拉选择", "从所选供应商产品清单中选择"),
            specRow("规格型号", "自动带出", "-", "文本只读", "选择商品后自动带出"),
            specRow("单价", "自动带出", "-", "数值只读", "自动带出供应商产品清单中的参考单价"),
            specRow("单位", "自动带出", "-", "文本只读", "选择商品后自动带出"),
            specRow("数量", "自填", "是", "数值输入框", "用户填写"),
            specRow("价格", "自填", "是", "数值输入框", "本次采购的实际协商价格"),
          ], "列名")),
          section("新供应商模式（是否新供应商 = 是）", fieldSpecTable([
            specRow("供应商名称", "自填", "是", "输入框", "新供应商的公司名称"),
            specRow("采购明细", "自填", "是", "明细表格", "见下方新供应商采购明细表"),
          ])),
          section("新供应商采购明细表", fieldSpecTable([
            specRow("商品名称", "自填", "是", "输入框", "手动输入"),
            specRow("规格型号", "自填", "否", "输入框", "手动输入"),
            specRow("单价", "自填", "是", "数值输入框", "手动输入"),
            specRow("单位", "自填", "是", "输入框", "手动输入"),
            specRow("数量", "自填", "是", "数值输入框", "手动输入"),
            specRow("价格", "自填", "是", "数值输入框", "手动输入"),
          ], "列名")),
          section("明细后通用字段", fieldSpecTable([
            specRow("合计金额", "自填", "是", "数值输入框", "手动填写合计金额"),
            specRow("支付节点", "自填/自动带出", "否", "自增表格", "若采购申请或比选中已填则自动带出，可修改"),
            specRow("交货验收", "自填/自动带出", "否", "多行文本", "若采购申请或比选中已填则自动带出，可修改"),
            specRow("权责与违约", "自填/自动带出", "否", "多行文本", "若采购申请或比选中已填则自动带出，可修改"),
            specRow("附则", "自填/自动带出", "否", "多行文本", "若采购申请或比选中已填则自动带出，可修改"),
          ])),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "分管副总审批", meta: "三级审批" }, { title: "抄送", meta: "发起人、比选发起人" }])),
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">提交审批</button>`,
      });
      return;
    case "inquiry-detail":
      openDrawer({
        title: `比选详情 - ${inquiryRow.code}`,
        subtitle: "详情直接展示比选和确定供应商两套审批表字段定义与流程轨迹。",
        body: [
          section("比选审批表字段", fieldSpecTable([
            specRow("选择项目", "自主选择", "是", "项目选择组件", "交付项目"),
            specRow("选择采购申请", "自主选择", "是", "关联审批表组件", "仅可选“已通过”且“需要比价”的采购申请"),
            specRow("采购标的", "自动带出", "-", "明细表只读", "选择采购申请后自动带出采购明细，仅供参考不可编辑"),
            specRow("支付节点", "自填/自动带出", "否", "自增表格", "若采购申请中已填则自动带出，可修改"),
            specRow("交货验收", "自填/自动带出", "否", "多行文本", "若采购申请中已填则自动带出，可修改"),
            specRow("权责与违约", "自填/自动带出", "否", "多行文本", "若采购申请中已填则自动带出，可修改"),
            specRow("附则", "自填/自动带出", "否", "多行文本", "若采购申请中已填则自动带出，可修改"),
          ])),
          section("确定供应商审批表字段", fieldSpecTable([
            specRow("选择比选", "自主选择", "是", "关联审批表组件", "仅可选“待确认供应商”的比选单据"),
            specRow("说明", "自填", "是", "多行文本", "说明最终决定选择哪个供应商的理由"),
            specRow("附件", "上传", "否", "上传组件", "支持多个附件，供应商回函/报价文件"),
            specRow("是否新供应商", "选择", "是", "单选", "决定后续字段展示逻辑"),
            specRow("已有供应商模式", "条件展示", "-", "供应商选择组件 + 明细表格", "从供应商库选择已有供应商，商品从产品库选择"),
            specRow("新供应商模式", "条件展示", "-", "输入框 + 明细表格", "填写新供应商名称，明细字段全部手填"),
            specRow("合计金额 / 支付节点 / 交货验收 / 权责与违约 / 附则", "自填/自动带出", "按字段规则", "数值输入框 / 自增表格 / 多行文本", "继承优先级：比选 > 采购申请"),
          ])),
          section("流程轨迹", timeline([{ title: "比选发起", meta: `${inquiryRow.applicant} ${inquiryRow.date}` }, { title: "比选审批", meta: "审批通过后状态切换为“待确认供应商”" }, { title: "确定供应商", meta: "仅状态满足时出现操作入口" }]))
        ].join(""),
      });
      return;
    case "contract-create":
      openModal({
        title: "新增采购合同",
        subtitle: "走审批表，提交后进入合同审批与用印流程。",
        width: "overlay-panel-1200",
        body: [
          approvalHint("该新增入口直接按采购合同用印审批表字段定义展示。"),
          section("自动带出字段（可修改）", fieldSpecTable([
            specRow("项目名称", "自动带出", "是", "文本只读", "来源于采购对象关联的项目"),
            specRow("供应商", "自动带出", "是", "文本/选择", "已有供应商显示名称（只读）；新供应商显示名称（只读）"),
            specRow("联系人", "自动带出", "否", "输入框", "已有供应商从供应商库带出，新供应商为空需手填"),
            specRow("联系方式", "自动带出", "否", "输入框", "同上"),
            specRow("税务类型", "自动带出", "否", "输入框", "已有供应商从供应商库带出"),
            specRow("采购明细", "自动带出", "是", "明细表格", "从采购对象带出采购明细，可修改"),
            specRow("支付节点", "自动带出", "否", "自增表格", "从采购对象带出，可修改"),
            specRow("交货验收", "自动带出", "否", "多行文本", "从采购对象带出，可修改"),
            specRow("权责与违约", "自动带出", "否", "多行文本", "从采购对象带出，可修改"),
            specRow("附则", "自动带出", "否", "多行文本", "从采购对象带出，可修改"),
          ])),
          section("采购明细表字段（可修改）", fieldSpecTable([
            specRow("商品名称", "-", "是", "输入框", "带出后可修改"),
            specRow("规格型号", "-", "否", "输入框", "带出后可修改"),
            specRow("数量", "-", "是", "数值输入框", "带出后可修改"),
            specRow("单价", "-", "是", "数值输入框", "带出后可修改"),
            specRow("单位", "-", "是", "输入框", "带出后可修改"),
            specRow("金额", "自动计算", "-", "数值只读", "数量 x 单价，自动计算"),
            specRow("合计金额", "自动汇总", "-", "数值只读", "自动汇总各行金额"),
          ], "列名")),
          section("合同信息字段", fieldSpecTable([
            specRow("合同级别", "选择", "是", "下拉组件", "重大 / 一般 / 简易"),
            specRow("我方单位名称", "选择", "是", "下拉组件", "零一通途、通途数智等"),
            specRow("我方负责人", "选择", "是", "用户选择", ""),
            specRow("我方负责人联系方式", "自填", "是", "输入框", ""),
            specRow("合同份数", "自填", "是", "数值输入", "合同打印份数"),
            specRow("用印名称", "自选", "是", "下拉组件", "公章 / 财务章 / 法人章等"),
            specRow("备注", "自填", "否", "多行文本", ""),
          ])),
          section("合同生成相关", fieldSpecTable([
            specRow("生成合同", "系统生成", "-", "按钮/系统动作", "使用已有合同模板生成 PDF 或 Word"),
            specRow("下载合同", "系统生成", "-", "下载按钮", "生成后提供下载查看确认"),
            specRow("合同附件", "系统生成/上传", "否", "上传组件", "生成的合同文件自动作为合同附件，也支持额外上传附件"),
          ])),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "法务 / 风控审批", meta: "三级审批，如有则触发" }, { title: "财务负责人审批", meta: "四级审批" }, { title: "总经理审批", meta: "五级审批" }, { title: "行政 / 合同管理员办理", meta: "完成用印与归档" }])),
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">提交审批</button>`,
      });
      return;
    case "contract-detail":
      openDrawer({
        title: `采购合同详情 - ${contractRow.code}`,
        subtitle: "详情直接展示采购合同审批表字段定义与审批流程。",
        body: [
          section("自动带出字段（可修改）", fieldSpecTable([
            specRow("项目名称", "自动带出", "是", "文本只读", "来源于采购对象关联的项目"),
            specRow("供应商", "自动带出", "是", "文本/选择", "已有供应商显示名称（只读）；新供应商显示名称（只读）"),
            specRow("联系人", "自动带出", "否", "输入框", "已有供应商从供应商库带出，新供应商为空需手填"),
            specRow("联系方式", "自动带出", "否", "输入框", "同上"),
            specRow("税务类型", "自动带出", "否", "输入框", "已有供应商从供应商库带出"),
            specRow("采购明细", "自动带出", "是", "明细表格", "从采购对象带出采购明细，可修改"),
            specRow("支付节点", "自动带出", "否", "自增表格", "从采购对象带出，可修改"),
            specRow("交货验收", "自动带出", "否", "多行文本", "从采购对象带出，可修改"),
            specRow("权责与违约", "自动带出", "否", "多行文本", "从采购对象带出，可修改"),
            specRow("附则", "自动带出", "否", "多行文本", "从采购对象带出，可修改"),
          ])),
          section("合同信息字段", fieldSpecTable([
            specRow("合同级别", "选择", "是", "下拉组件", "重大 / 一般 / 简易"),
            specRow("我方单位名称", "选择", "是", "下拉组件", "零一通途、通途数智等"),
            specRow("我方负责人", "选择", "是", "用户选择", ""),
            specRow("我方负责人联系方式", "自填", "是", "输入框", ""),
            specRow("合同份数", "自填", "是", "数值输入", "合同打印份数"),
            specRow("用印名称", "自选", "是", "下拉组件", "公章 / 财务章 / 法人章等"),
            specRow("备注", "自填", "否", "多行文本", ""),
          ])),
          section("流程轨迹", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "法务 / 风控审批", meta: "三级审批，如有则触发" }, { title: "财务负责人审批", meta: "四级审批" }, { title: "总经理审批", meta: "五级审批" }, { title: "行政 / 合同管理员办理", meta: "完成用印与归档" }]))
        ].join(""),
      });
      return;
    case "contract-payment-request":
      openModal({
        title: "发起付款申请",
        subtitle: "走审批表，提交后进入付款审批流程。",
        width: "overlay-panel-960",
        body: [
          approvalHint("该新增入口直接按付款申请审批表字段定义展示。"),
          section("审批表字段", fieldSpecTable([
            specRow("选择采购合同", "自主选择", "是", "下拉选择", "仅可选“已通过”的采购合同，显示：合同编号 - 供应商名称 - 合计金额"),
            specRow("项目名称", "自动带出", "-", "文本只读", "选择采购合同后自动带出"),
            specRow("供应商", "自动带出", "-", "文本只读", "选择采购合同后自动带出"),
            specRow("合同金额", "自动带出", "-", "数值只读", "选择采购合同后自动带出合计金额"),
            specRow("已付金额", "自动计算", "-", "数值只读", "该合同已审批通过的付款申请金额之和"),
            specRow("待付金额", "自动计算", "-", "数值只读", "合同金额 - 已付金额"),
            specRow("本次付款金额", "自填", "是", "数值输入框", "不能超过待付金额，超过时红色预警提示"),
            specRow("开户银行", "自动带出/自填", "是", "输入框", "已有供应商自动带出，可修改；新供应商需手填"),
            specRow("银行账户", "自动带出/自填", "是", "输入框", "已有供应商自动带出，可修改；新供应商需手填"),
            specRow("附件", "上传", "否", "上传组件", "上传发票附件，不需要 OCR 识别"),
            specRow("备注", "自填", "否", "多行文本", ""),
          ])),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "财务负责人审批", meta: "三级审批" }, { title: "总经理审批", meta: "四级审批" }, { title: "出纳办理", meta: "审批通过后进入支付管理执行支付" }, { title: "抄送", meta: "发起人" }]))
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">提交审批</button>`,
      });
      return;
    case "payment-request-create":
      openModal({
        title: "发起付款申请",
        subtitle: "走审批表，提交后进入付款审批流程。",
        width: "overlay-panel-960",
        body: [
          approvalHint("该新增入口直接按付款申请审批表字段定义展示。"),
          section("审批表字段", fieldSpecTable([
            specRow("选择采购合同", "自主选择", "是", "下拉选择", "仅可选“已通过”的采购合同，显示：合同编号 - 供应商名称 - 合计金额"),
            specRow("项目名称", "自动带出", "-", "文本只读", "选择采购合同后自动带出"),
            specRow("供应商", "自动带出", "-", "文本只读", "选择采购合同后自动带出"),
            specRow("合同金额", "自动带出", "-", "数值只读", "选择采购合同后自动带出合计金额"),
            specRow("已付金额", "自动计算", "-", "数值只读", "该合同已审批通过的付款申请金额之和"),
            specRow("待付金额", "自动计算", "-", "数值只读", "合同金额 - 已付金额"),
            specRow("本次付款金额", "自填", "是", "数值输入框", "不能超过待付金额，超过时红色预警提示"),
            specRow("开户银行", "自动带出/自填", "是", "输入框", "已有供应商自动带出，可修改；新供应商需手填"),
            specRow("银行账户", "自动带出/自填", "是", "输入框", "已有供应商自动带出，可修改；新供应商需手填"),
            specRow("附件", "上传", "否", "上传组件", "上传发票附件，不需要 OCR 识别"),
            specRow("备注", "自填", "否", "多行文本", ""),
          ])),
          section("审批流程", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "财务负责人审批", meta: "三级审批" }, { title: "总经理审批", meta: "四级审批" }, { title: "出纳办理", meta: "审批通过后进入支付管理执行支付" }, { title: "抄送", meta: "发起人" }]))
        ].join(""),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">提交审批</button>`,
      });
      return;
    case "payment-request-detail":
      openDrawer({
        title: `付款申请详情 - ${paymentRow.code}`,
        subtitle: "详情直接展示付款申请审批表字段定义与审批流程。",
        body: [
          section("审批表字段", fieldSpecTable([
            specRow("选择采购合同", "自主选择", "是", "下拉选择", "仅可选“已通过”的采购合同，显示：合同编号 - 供应商名称 - 合计金额"),
            specRow("项目名称", "自动带出", "-", "文本只读", "选择采购合同后自动带出"),
            specRow("供应商", "自动带出", "-", "文本只读", "选择采购合同后自动带出"),
            specRow("合同金额", "自动带出", "-", "数值只读", "选择采购合同后自动带出合计金额"),
            specRow("已付金额", "自动计算", "-", "数值只读", "该合同已审批通过的付款申请金额之和"),
            specRow("待付金额", "自动计算", "-", "数值只读", "合同金额 - 已付金额"),
            specRow("本次付款金额", "自填", "是", "数值输入框", "不能超过待付金额，超过时红色预警提示"),
            specRow("开户银行", "自动带出/自填", "是", "输入框", "已有供应商自动带出，可修改；新供应商需手填"),
            specRow("银行账户", "自动带出/自填", "是", "输入框", "已有供应商自动带出，可修改；新供应商需手填"),
            specRow("附件", "上传", "否", "上传组件", "上传发票附件，不需要 OCR 识别"),
            specRow("备注", "自填", "否", "多行文本", ""),
          ])),
          section("流程与联动", timeline([{ title: "直属上级审批", meta: "一级审批" }, { title: "部门负责人审批", meta: "二级审批" }, { title: "财务负责人审批", meta: "三级审批" }, { title: "总经理审批", meta: "四级审批" }, { title: "出纳办理", meta: "审批通过后进入支付管理页面，等待财务执行实际支付" }, { title: "支付完成联动", meta: "联动更新付款申请状态、采购合同已付金额、供应商费用已支付/待支付字段" }]))
        ].join(""),
      });
      return;
    case "stock-in-create":
    case "stock-out-create":
      openModal({
        title: action === "stock-in-create" ? "新增入库" : "新增出库",
        subtitle: "出入库登记为独立执行页面，不走审批，但必须保留操作人与操作时间。",
        width: "overlay-panel-720",
        body: section(
          action === "stock-in-create" ? "入库信息" : "出库信息",
          simpleForm(
            action === "stock-in-create"
              ? [
                  fakeInput("物品名称", stockRow?.name ?? "请输入物品名称"),
                  fakeInput("规格型号", stockRow?.spec ?? "请输入规格型号"),
                  fakeInput("单位", stockRow?.unit ?? "请输入单位"),
                  fakeInput("数量", stockRow?.qty ?? "请输入数量"),
                  fakeInput("存放位置", stockRow?.place ?? "请输入存放位置"),
                  fakeInput("来源说明", stockRow?.source ?? "请输入来源说明"),
                  fakeInput("入库人", stockRow?.user ?? "默认当前登录人"),
                  fakeInput("入库时间", stockRow?.time ?? "2026-04-08 16:20"),
                  fakeTextarea("备注", stockRow?.remark ?? "填写签收、现场说明等。", 1),
                  fakeUpload("附件", "上传签收单、现场照片等", 1),
                ]
              : [
                  fakeInput("物品名称", stockRow?.name ?? "请输入物品名称"),
                  fakeInput("规格型号", stockRow?.spec ?? "请输入规格型号"),
                  fakeInput("单位", stockRow?.unit ?? "请输入单位"),
                  fakeInput("数量", stockRow?.qty ?? "请输入数量"),
                  fakeInput("领用去向", stockRow?.target ?? "请输入领用去向"),
                  fakeInput("领用人/部门", stockRow?.owner ?? "请输入领用人或部门"),
                  fakeInput("出库人", stockRow?.user ?? "默认当前登录人"),
                  fakeInput("出库时间", stockRow?.time ?? "2026-04-08 16:20"),
                  fakeTextarea("备注", stockRow?.remark ?? "填写出库用途与说明。", 1),
                  fakeUpload("附件", "上传领用单、现场照片等", 1),
                ]
          )
        ),
      });
      return;
    case "stock-detail":
      openDrawer({
        title: `记录详情 - ${stockRow.code}`,
        subtitle: "展示物品、数量、操作人、时间与附件信息。",
        body: section("记录信息", grid([field("单号", stockRow.code), field("物品名称", stockRow.name), field("规格型号", stockRow.spec), field("单位", stockRow.unit), field("数量", stockRow.qty), field("操作人", stockRow.user), field("操作时间", stockRow.time), fakeTextarea("备注", stockRow.remark, 2)])),
      });
      return;
    case "delete-generic":
      openModal({
        title: `删除${target?.dataset.name ?? "记录"}`,
        subtitle: "高保真预览中仅展示二次确认流程，不实际删除数据。",
        width: "overlay-panel-720",
        body: section("确认删除", notice([`确认删除当前${target?.dataset.name ?? "记录"}吗？`, "真实业务中应校验是否已被单据引用，引用中的数据不允许删除。"])),
        footer: `<button class="btn" type="button" data-close="modal">取消</button><button class="btn primary" type="button" data-close="modal">确认删除</button>`,
      });
      return;
    case "download-generic":
      openModal({
        title: `下载${target?.dataset.name ?? "文件"}`,
        subtitle: "原型中用弹窗提示代替真实下载动作。",
        width: "overlay-panel-720",
        body: section("文件信息", notice([`${target?.dataset.name ?? "文件"}已生成，可提供 PDF / Word 下载。`, "正式实现时需接入真实文件下载地址。"])),
        footer: `<button class="btn" type="button" data-close="modal">关闭</button><button class="btn primary" type="button" data-close="modal">模拟下载</button>`,
      });
      return;
    default:
      break;
  }
}

document.addEventListener("click", (event) => {
  const navTarget = event.target.closest("[data-nav]");
  if (navTarget) {
    state.activePage = navTarget.getAttribute("data-nav");
    renderPage();
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget) {
    handleAction(actionTarget.getAttribute("data-action"), actionTarget.getAttribute("data-row-id"), actionTarget);
    return;
  }

  const pageTarget = event.target.closest("[data-page-key]");
  if (pageTarget) {
    const key = pageTarget.getAttribute("data-page-key");
    state.pagination[key] = Number(pageTarget.getAttribute("data-page"));
    renderTableByKey(key);
    return;
  }

  const tabTarget = event.target.closest("[data-tab-group]");
  if (tabTarget) {
    state.tabs[tabTarget.getAttribute("data-tab-group")] = tabTarget.getAttribute("data-tab");
    renderPage();
    return;
  }

  const projectTarget = event.target.closest("[data-project-option]");
  if (projectTarget) {
    state.pendingProjectId = projectTarget.getAttribute("data-project-option");
    renderProjectSelector(projectSearchInput.value);
    return;
  }

  const closeTarget = event.target.closest("[data-close]");
  if (closeTarget) {
    const kind = closeTarget.getAttribute("data-close");
    if (kind === "project") closeProjectModal();
    if (kind === "modal") closeModal();
    if (kind === "drawer") closeDrawer();
  }
});

projectSearchInput.addEventListener("input", () => {
  renderProjectSelector(projectSearchInput.value);
});

projectConfirmBtn.addEventListener("click", () => {
  state.currentProjectId = state.pendingProjectId;
  closeProjectModal();
  renderPage();
});

window.addEventListener("resize", resizeCharts);

renderProjectSelector();
renderPage();
