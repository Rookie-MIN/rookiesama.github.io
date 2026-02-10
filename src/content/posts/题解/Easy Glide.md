---
title: Easy Glide
published: 2026-01-26
pinned: false
description: 2022省赛G:最短路扩展问题
tags:
  - 最短路
  - 图论
category: 题解
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-01-26
pubDate: 2026-01-26
---
## [Easy Glide](https://qoj.ac/contest/2056/problem/11372)

##  **问题理解与转化**

- **清晰的问题重述**：用简洁的语言描述问题
    
- **输入输出格式**：明确说明数据范围和格式要求
    
- **约束条件分析**：识别时间、空间限制等关键约束
    
- **问题转化**：将实际问题抽象为数学模型
## 1.题目概述
- 在二维平面中，从起点S到终点T，通过**行走**或触发滑翔点后的**滑翔**移动，求抵达终点的**最短时间**。

### 核心移动规则

1. 行走：任意时刻可进行，速度为V1；
2. 滑翔：触碰**任意一个**滑翔点后，**接下来 3 秒**可进行，速度为V2（题目保证V1<V2）；
3. 仅滑翔窗口期内可滑翔，其余时间只能行走，窗口期仅由触碰滑翔点触发，无其他触发方式。

### 输入信息

1. 整数n（1≤n≤1000）：滑翔点的数量；
2. n组整数坐标(xi​,yi​)：各滑翔点的平面位置；
3. 4 个整数Sx​,Sy​,Tx​,Ty​：起点S、终点T的平面坐标；
4. 2 个整数V1,V2：行走、滑翔的速度。

### 输出要求

输出最短时间，答案的**绝对误差 / 相对误差**不超过$10^{-6}$即判定为正确。

**关键约束**：
## 2. **核心思路阐述**

- **算法选择理由**：为什么选择这个算法
    
- **关键观察点**：问题的特殊性质
    
- **思维过程**：如何想到这个解法
### 解题思路
- 很明显，本题是**最短路问题**， 只不过这个变成了**时间**，问你最短需要多少时间能到。
- 我们可以采用 [[dijkstra]] 算法解决该问题
- 但题目中所给出的是二维图像中的**点坐标**，因此需要先计算点与点的距离，再去计算，点到点的时间，用dijkstra 跑一遍，算出最小时间
- 
### 关键观察
- 题目说： 从 start 点 到 end 点 所需的最小时间，很**明显就是dijk**的问题
- 其实本质有点像 dp 的动态规划，每次都是从 A -> B 的更新( 如果存在拓扑序，则可以用dp 来写，但很显然，**并不存在拓扑序**， 我 A-> B  且 B -> A)

## 3. **详细算法设计**

- **步骤分解**：逐步说明算法流程
    
- **数据结构**：使用的数据结构及其作用
    
- **伪代码**：清晰的算法描述
### 算法步骤
- 1. 先将数据存储在 Point 的类里
- 2. 创建图，将每两点进行连接，并且A - B的距离是 A - B 所花的时间 
- 3. 直接用dijk 跑一遍最短路 $dist[n]$ 就是我们的答案
- ```cpp
  class Point{
public:
    int x, y, id; //存放 x y坐标 id = 1 表示start = n 表示 end
    double operator -(const Point &t) const{ // 这里使用了重载，直接计算 A到B的时间
        double dist = sqrt((x - t.x) * (x - t.x) + (y - t.y) * (y - t.y));
        if(id == n || id == 1){

            return dist / v1;
        }
        if(v2 * 3 >= dist) {
            return dist / v2;
        }
        return (dist - v2 * 3) / v1 + 3;
    }
    friend istream& operator>>(istream &in,Point& t);

};
  ```


## 4. **复杂度分析**

- **时间复杂度**：详细分析每个步骤的时间开销
    
- **空间复杂度**：分析内存使用情况
    
- **实际性能**：预估在实际数据规模下的表现

### 复杂度分析:
-  时间复杂度
	- 创图: $O(n^2)$, dijk :$O(n \log n^2)$
	- 总体控制在 $O(n^2),n \leq 1000$ 能够实现 

-  空间复杂度
	- 创图: $O(n^2)$

## 5. **代码实现**
``` cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
#define x first
#define y second

const int N = 1e3 + 10;

using PDI = pair<double, int>;
int v1, v2, n;
class Point{
public:
    int x, y, id;
    double operator -(const Point &t) const{
        double dist = sqrt((x - t.x) * (x - t.x) + (y - t.y) * (y - t.y));
        if(id == n || id == 1){
            return dist / v1;
        }
        if(v2 * 3 >= dist) {
            return dist / v2;
        }
        return (dist - v2 * 3) / v1 + 3;
    }
    friend istream& operator>>(istream &in,Point& t);
};

istream& operator>>(istream &in,Point& t){
    in >> t.x >> t.y;
    return in;
}

Point p[N];
int h[N], ne[N * N * 2], e[N * N * 2],idx;
double w[N * N * 2],dist[N];
int st[N];

void add(int a, int b){
    e[idx] = b, w[idx] = p[a] - p[b], ne[idx] = h[a], h[a] = idx++;
}

void dijk(){
    for(int i = 1; i <= n; i++) dist[i] = 1e9;
    dist[1] = 0;
    priority_queue<PDI,vector<PDI>,greater<PDI>> heap;
    heap.push({0, 1});
    
    while(heap.size()){
        auto t = heap.top();
        heap.pop();
        int ver = t.y;
        double dis = t.x;
        if(st[ver]) continue;
        st[ver] = 1;
        for(int i = h[ver]; ~i; i = ne[i]){
            int j = e[i];
            if(dist[j] > dis + w[i]){
                dist[j] = dis + w[i];
                //cout << dist[j] << " " << ver << " " << j << endl;
                heap.push({dist[j], j});
            }
        }
    }
    cout << fixed << setprecision(12) << dist[n] << endl;
}

void solve(){
    cin >> n;
    n++;
    memset(h, -1, sizeof h);
    for(int i = 2; i <= n; i++) cin >> p[i],p[i].id = i;
    n++;
    cin >> p[1] >> p[n];
    p[1].id = 1, p[n].id = n;
    cin >> v1 >> v2;
    for(int i = 1; i <= n; i++){
        for(int j = i + 1; j <= n; j++){
            add(i, j), add(j, i);
        }
    }
    dijk();
    
}

signed main(){
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
    int _ = 1;
    //cin >> _;
    while(_--){
        solve();
    }
}
```

## 6. **常见错误与陷阱**

- **易错点分析**：其他人容易犯的错误
    
- **调试技巧**：如何定位和修复错误
    
- **优化建议**：进一步优化的可能性

### 常见错误
- 将二维图像点坐标转换为，边与边的距离时，可能会因处理不当导致错误，或者说精度不够
- 二维图像转为点坐标，对于目前的我来说，有点吃熟练度，并且不知道怎么去转换

### 优化建议
- 对于某些题目要求更高精度，或者不能出现 整除 的情况，建议使用 `long double` 这可以满足 $10^9$ 除法的精度
- 二维图像对于目前来说，也没有什么太多的建议，一般都是离散存图，建立点与点的关系。直接去写。


## 7. **拓展与变种**

- **相关问题**：[E - Laser Takahashi](https://atcoder.jp/contests/abc442/tasks/abc442_e)(题目在 [[AtCoder Beginner Contest 442]] E中)
    
- **变种问题**：改变路径上的权值，或者说增加代价(不仅要满足路径，还要满足在其他代价)
    
- **实际应用**： **单源最短路综合问题**


## 8. **总结与收获**

### 总结
- 一道**综合性单源最短路问题**
### 核心知识点
- 1. [[dijkstra]]
- 2. 二维坐标离散建图(坐标本就是离散的，主要是**建图，存图**)
- 3. 精度不够要用 `long double`
### 学习建议
- 这种题目更吃熟练度，属于板子类题目，最好能多写，多练
- 推荐限时练
