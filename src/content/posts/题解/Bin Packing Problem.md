---
title: Bin Packing Problem
published: 2026-01-19
pinned: false
description: 2020浙江省赛B：一道线段树 + multiset 板子题
tags:
  - 线段树
category: 题解
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-01-19
pubDate: 2026-01-19
---
# 装箱问题 - 首次适应与最佳适应[[算法]]

## 一、核心任务

实现两种经典的装箱问题近似算法（首次适应算法、最佳适应算法），针对每组输入数据，统计两种算法分别需要使用的箱子总数并输出。

## 二、题目背景与核心定义

### 装箱问题核心
将不同体积的物品装入固定容量为 `C` 的箱子中，目标是最小化箱子使用数量（该问题为 **NP 难组合优化问题**，无多项式时间精确解，需用近似算法）。

### 物品约束
每个物品体积 $a_i \leq C$，确保单个物品可装入一个箱子。

### 两个经典近似算法

| 算法名称 | 核心规则 |
|---------|---------|
| **首次适应算法（First Fit）** | 尝试将当前物品放入箱子列表中第一个能容纳它的箱子，无合适箱子则新增箱子 |
| **最佳适应算法（Best Fit）** | 尝试将当前物品放入能容纳它且剩余空间最小的箱子（最优选择），无合适箱子则新增箱子 |

### 箱子剩余空间
箱子容量 `C` - 已装入该箱子的所有物品体积之和，判断 "能否容纳" 的依据是「剩余空间 ≥ 物品体积」。

## 三、输入输出要求

### 1. 输入格式

- **第一行**：正整数 `T`（测试用例数量）。
- **每组用例**：
  - 第一行：两个整数 `n`（物品数量）、`C`（箱子固定容量），其中 $1 \leq n \leq 10^6$，$1 \leq C \leq 10^9$。
  - 第二行：`n` 个整数 $a_i$（第 `i` 个物品的体积），$1 \leq a_i \leq C$。

> **数据约束**：所有测试用例的 `n` 之和不超过 $10^6$（避免数据量过大超时）。

### 2. 输出格式

每组用例输出一行，包含两个整数，依次为首次适应算法（First Fit）、最佳适应算法（Best Fit）的箱子使用数量。

## 四、样例核心提炼

输入的 2 组用例对应输出：

1. **2 个体积为 1 的物品，箱子容量 2**：两种算法均只需 1 个箱子（输出 `1 1`）。

2. **5 个物品（5、8、2、5、9），箱子容量 10**：首次适应需 4 个箱子，最佳适应需 3 个箱子（输出 `4 3`），体现最佳适应算法的近似效果更优。

## 五、解题思路

### 1. 首次适应算法（First Fit）
 - 由于题目的数据过于大，无法直接模拟，需要考虑更高效的算法。
 - 对于**区间问题**我们能想到 **ST 线段树 树状数组**，但是由于我们需要维护**区间最大值**，因为 **ST 和 树状数组 不适合修改区间**，所以我们需要使用线段树。
 - 时间复杂度为 $O(n \log n)$(建树 + 查询 + 更新 + 修改)
```cpp
//更新最大值
void pushup(Node& u, Node& l, Node& r){
    if(l.ma >= r.ma){
        u.id = l.id, u.ma = l.ma;
    }
    else u.id = r.id,u.ma = r.ma;
}

void pushup(int u){
    pushup(tr[u], tr[u << 1], tr[u << 1 | 1]);
}
//建树过程
void build(int u,int l, int r){
    tr[u].l = l, tr[u].r = r;
    if(l == r){
        tr[u].ma = 0;
        tr[u].id = l;
    }
    else{
        int mid = l + r >> 1;
        build(u << 1, l ,mid), build(u << 1 | 1, mid + 1, r);
        pushup(u);
    }
}
// 对单点进行修改, 将 x 位置的最大值修改为 v
void modify(int u,int x, int v){
    if(tr[u].l == x && tr[u].r == x){
        tr[u].ma = v;
    }
    else{
        int mid = tr[u].l + tr[u].r >> 1;
        if(x <= mid) modify(u << 1, x, v);
        else modify(u << 1 | 1, x, v);
        pushup(u); //最后往上更新
    }
}
// 查询第一个大于等于 x 的位置 如果在线段树中没有比x大的则直接返回 0
int query(int u, int x){
    if(tr[u].ma < x) return 0;
    if(tr[u].l == tr[u].r){
        return tr[u].id;
    }
    if(tr[u << 1].ma >= x){
        return query(u << 1, x);
    }
    return query(u << 1 | 1, x);
}
int firstfit(){
    build(1, 1, n);//建树 大小为 n
    int cnt = 0;
    for(int i = 1; i <= n; i++){
        int t = query(1, a[i]);
        if(t){
            b[t] -= a[i]; //b[t] 表示第 t 个箱子的剩余空间
            modify(1, t, b[t]);
        }
        else{
            b[++cnt] = m - a[i];
            modify(1, cnt, b[cnt]);
        }
    }
    return cnt;
}
```


### 2. 最佳适应算法（Best Fit）
  - 由于我们需要维护的是**区间最小值**，所以我们可以直接使用**STL**中的**multiset 或 priority** 来维护。(这里采用 multiset)
  - 因为multiset **是有序的**，所以我们可以直接使用 **lower_bound** 来找到第一个大于等于当前物品体积的箱子。
  - 若找到，则将当前物品放入该箱子中，否则新增一个箱子。最后计算总共的箱子数即可。

```cpp
int Bestfit(){
    multiset<int> A; //用于维护箱子的剩余空间，从小到大排序
    int cnt = 0;
    for(int i = 1; i <= n; i++){
        auto it = A.lower_bound(a[i]);//迭代器指向第一个大于等于 a[i] 的位置
        if(it != A.end()){ //表示当前存在大于a[i]的值
            A.insert(*it - a[i]); //将当前箱子的剩余空间减去 a[i] 后插入到 multiset 中
            A.erase(it); //删除当前箱子的剩余空间
        }else{
            A.insert(C - a[i]); //将当前物品放入新箱子中
            cnt++;
        }
    }
    return cnt;
}
```

### 3. 本题主要收获
  - 学会如何使用 **multiset 的 it迭代器**
```
比如： *it 表示当前迭代器指向的位置的值
it 表示当前迭代器指向的位置（地址）
erase(it) 表示删除当前迭代器指向的位置（注意用的是迭代器删）
```
  - 简单复习了线段树板子
```
pushup(u); //更新当前节点的最大值
build(u, l, r); //建树过程
modify(u, x, v); //对单点进行修改, 将 x 位置的最大值修改为 v
query(u, x); //查询第一个大于等于 x 的位置
```

## 代码
```cpp
#include<bits/stdc++.h>

using namespace std;
//#define int long long
#define IOS ios::sync_with_stdio(0),cin.tie(0),cout.tie(0)  // 加速IO操作
#define x first
#define y second
#define endl "\n"
typedef signed long long LL;
typedef pair<int, int> PII;

const int N = 2e6 + 10 , Mod = 998244353, INF = 0x3f3f3f3f, M = 1e7 + 10;

// 线段树节点结构体，用于维护区间最大值及其位置
class Node{
public:
    int l, r;    // 节点表示的区间范围 [l, r]
    int id;      // 当前区间内最大值所在的位置
    int ma;      // 当前区间内的最大值
};

Node tr[N * 4];  // 线段树数组，四倍空间防止越界
int n, m;        // n: 物品数量, m: 箱子容量
int a[N], b[N];  // a[i]: 第i个物品的体积, b[i]: 第i个箱子的剩余空间

// 合并两个子节点的信息，更新父节点的最大值和位置
void pushup(Node& u, Node& l, Node& r){
    if(l.ma >= r.ma){
        u.id = l.id, u.ma = l.ma;  // 左子树最大值更大，更新为左子树的信息
    }
    else u.id = r.id,u.ma = r.ma; // 右子树最大值更大，更新为右子树的信息
}

// 重载函数：通过节点编号调用pushup，合并左右子树信息
void pushup(int u){
    pushup(tr[u], tr[u << 1], tr[u << 1 | 1]);
}

// 构建线段树，初始化每个叶子节点的值
void build(int u,int l, int r){
    tr[u].l = l, tr[u].r = r;
    if(l == r){
        tr[u].ma = 0;    // 初始时所有箱子的剩余空间都是0
        tr[u].id = l;    // 记录位置
    }
    else{
        int mid = l + r >> 1;
        build(u << 1, l ,mid), build(u << 1 | 1, mid + 1, r);
        pushup(u);
    }
}

// 修改线段树中位置x的值为v，并更新相关节点的信息
void modify(int u,int x, int v){
    if(tr[u].l == x && tr[u].r == x){
        tr[u].ma = v;  // 找到目标位置，更新值
    }
    else{
        int mid = tr[u].l + tr[u].r >> 1;
        if(x <= mid) modify(u << 1, x, v);  // 目标在左子树
        else modify(u << 1 | 1, x, v);      // 目标在右子树
        pushup(u);  // 更新当前节点的信息
    }
}

// 查询第一个剩余空间大于等于x的箱子位置
// 如果没有这样的箱子，返回0
int query(int u, int x){
    if(tr[u].ma < x) return 0;  // 当前区间最大值都小于x，无解
    if(tr[u].l == tr[u].r){
        return tr[u].id;  // 找到叶子节点，返回位置
    }
    if(tr[u << 1].ma >= x){  // 左子树有解，优先在左子树查找
        return query(u << 1, x);
    }
    return query(u << 1 | 1, x);  // 否则在右子树查找
}

// 首次适应算法（First Fit）
// 策略：将物品放入第一个能容纳它的箱子
int firstfit(){
    build(1, 1, n);  // 构建线段树，维护箱子剩余空间
    int cnt = 0;     // 当前使用的箱子数量
    
    for(int i = 1; i <= n; i++){
        int t = query(1, a[i]);  // 查询第一个能容纳当前物品的箱子
        
        if(t){
            // 找到合适的箱子，将物品放入
            b[t] -= a[i];              // 更新箱子剩余空间
            modify(1, t, b[t]);        // 在线段树中更新这个箱子的剩余空间
        }
        else{
            // 没有找到合适的箱子，创建新箱子
            b[++cnt] = m - a[i];         // 新箱子的剩余空间 = 容量 - 物品体积
            modify(1, cnt, b[cnt]);      // 在线段树中添加新箱子
        }
    }
    return cnt;  // 返回使用的箱子总数
}

// 最佳适应算法（Best Fit）
// 策略：将物品放入能容纳它且剩余空间最小的箱子
int Bestfit(){
    multiset<int> A;  // 用multiset维护所有箱子的剩余空间，自动排序
    int cnt = 0;      // 当前使用的箱子数量

    for(int i = 1; i <= n; i++){
        // 找到第一个剩余空间 >= 当前物品体积的箱子
        auto it = A.lower_bound(a[i]);

        if(it != A.end()){
            // 找到合适的箱子，将物品放入
            int t = *it - a[i];    // 计算放入后的剩余空间
            A.erase(it);           // 从multiset中删除原剩余空间
            A.insert(t);           // 插入新的剩余空间
        }else{
            // 没有找到合适的箱子，创建新箱子
            A.insert(m - a[i]);    // 插入新箱子的剩余空间
            cnt++;                 // 箱子数量增加
        }
    }
    return cnt;  // 返回使用的箱子总数
}

// 处理单个测试用例
void solve() {
    cin >> n >> m;  // 读入物品数量和箱子容量

    for (int i = 1; i <= n; i++) cin >> a[i];  // 读入每个物品的体积

    // 输出两种算法的结果：首次适应算法和最佳适应算法
    cout << firstfit() << " " << Bestfit()<< endl;
}

// 主函数
signed main() {
    IOS;  // 加速IO操作
    
    int _;  // 测试用例数量
    cin >> _;
    
    // 处理每个测试用例
    while (_--) {
        solve();
    }
    
    return 0;
}
```