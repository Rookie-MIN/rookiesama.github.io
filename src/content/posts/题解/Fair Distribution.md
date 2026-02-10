---
title: Fair Distribution
published: 2026-01-21
pinned: false
description: 2021省赛F：数学,数论分块优化遍历
tags:
  - 数学
category: 题解
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-01-21
pubDate: 2026-01-21
---
##  **问题理解与转化**

## 1.题目概述
- 有 n 个机器人 和 m 个能量棒，现在你能进行两个操作
	- 1.消灭一个机器人
	- 2.产生一个能量棒
- 要求操作后的 m1 % n1 == 0 的最小操作数 

**输入**：
```
3
3 12
10 6
8 20
```

**输出**：
```
0
4
2
```


**关键约束**：$n, m \leq 10^8$  数据量大，不支持一个个算，需要有一些快速的办法计算

**问题理解**: 题目问我们的是**能分配的前提**下，**最小的操作数**
 - 操作数: $f(n`)=(n-n`)+(m`-m)$ 
 - 能够分配: $m`=\lceil \frac{m}{n`} \rceil*n`$
 - 根据这两个式子带入约化得到只包含 $n`$ 的函数表达式，故可以计算答案
## 2. **核心思路阐述**
### 解题思路
 - 根据式子式子代入，我们会得到一个式子:
	- $f(n`)=(n-n`)+(\lceil \frac{m}{n`} \rceil*n`-m)$
	- $f(n`)=(n-m)+(\lceil \frac{m}{n`} \rceil-1)*n`$
	- $f(n`)=(n-m)+\lfloor \frac{m-1}{n`} \rfloor*n`$ 关键转换 -> $\lceil \frac{m}{n`} \rceil-1=\lfloor \frac{m-1}{n`} \rfloor$
	- 根据式子我们可以清晰发现，题目转换为取 $n`$ 使得函数$f(n`)$ 最小
### 关键观察
 - 观察式子发现$\lfloor \frac{m-1}{n`} \rfloor*n`$ 这是经典的**数论分块(整除分块)形式**
 - 每当取一个`n`都会有一个区间`[l,r]` 使得$\lfloor \frac{m-1}{n`} \rfloor$ 的相同,因为$(n-m)$的值是固定的,因此要使$f(n`)$取到最小值,必须尽量让$n`$取小, 让$n`=l$即可 


## 3. **详细算法设计**

- **步骤分解**：
	- 根据上面分析，我们只需要遍历所有$\lfloor \frac{m-1}{n`} \rfloor$ 所有可能的值，并将 $l$ 代入即可
	- 计算`[l,r]:` `l`从1开始，`r取带入l与`$\lfloor (m-1)/l \rfloor$ 相等的最大值
	- 设$v=\lfloor (m-1)/l \rfloor,r=\lfloor (m-1)/v \rfloor$ 
	- 用`l`带入式子得到答案，取min, `l = r + 1` 开始遍历查找.
 ```cpp
     for(int l = 1, r; l <= n; l = r + 1){
        int v = x / l;
        //这里的 l 和 r 表示 选择[l, r]区间的任何数 floor((m-1)/i) 都相等
        r = (v == 0) ? n : min(n, x / v);  //数论分块理论
        ans = min(ans, n - m + l * (x / l));
    }
 ```

- **复杂度分析**
  -   $O(T*\sqrt{m})$ 每一个问题需要$\sqrt{m}$的时间计算 

## 4. **正确性证明**

- **边界情况**：选择全增加能量棒$(n-m\%n)$
    
- **特殊情况**：当$n>m$时，由于n只能减少，m只能增加，故最小的操作数就是$n-m$
    
- **数学证明**：  $\lceil \frac{m}{n`} \rceil-1=\lfloor \frac{m-1}{n`} \rfloor$
设 $m = q n' + r$，其中 $0 \le r < n'$，$q$ 为整数。  

- **若 $r = 0$**（$m$ 被 $n'$ 整除）：  
  左边 $\lceil m/n' \rceil - 1 = q - 1$；  
  右边 $\lfloor (m-1)/n' \rfloor = \lfloor (q n' - 1)/n' \rfloor = \lfloor q - 1/n' \rfloor = q - 1$。  

- **若 $r \ge 1$**：  
  左边 $\lceil m/n' \rceil - 1 = (q + 1) - 1 = q$；  
  右边 $\lfloor (m-1)/n' \rfloor = \lfloor (q n' + r - 1)/n' \rfloor = \lfloor q + (r-1)/n' \rfloor = q$  
  （因为 $0 \le r-1 < n'$，故 $(r-1)/n' < 1$）。  
### 验证逻辑的正确性
- 我们证明了公式的正确性，满足$f(n`)$和 `m能被n整除` 的两个条件
- 我们遍历了所有可能存在的$\lfloor \frac{m-1}{n`} \rfloor$值，并取最小的$n`$，对答案取min
- 特判 `n > m 和 全部用来制作能量棒` 的特殊情况
- 最后得到的答案一定是所有答案中最小的一个


## 5. **复杂度分析**

- **时间复杂度**：计算单个答案$\sqrt{m}$
    
- **空间复杂度**：(忽略)
    
- **实际性能**：$O(T*\sqrt m)$

## 6. **代码实现**
``` cpp
#include <bits/stdc++.h>

using namespace std;
#define int long long
#define IOS ios::sync_with_stdio(0), cin.tie(0), cout.tie(0)
#define x first
#define y second
#define endl "\n"
typedef signed long long LL;
typedef pair<int, int> PII;

const int N = 1e5 + 10;
//f(n`) = (n - n`) + (m` - m)
// 注意：这里的公式推导
// 原式 = (n-i) + (ceil(m/i)*i - m)
// = n - m + i * (ceil(m/i) - 1)
// = n - m + i * floor((m-1)/i)
// 所以代价是 ans = min(ans, n - m + l * v);
void solve() {
    int n, m;
    cin >> n >> m;
    if(n > m) {
        cout << n - m << endl;
        return;
    }
    int x = m - 1;
    int ans = (n - m % n) % n; //全部都添加 能量棒
    for(int l = 1, r; l <= n; l = r + 1){
        int v = x / l;
        //这里的 l 和 r 表示 选择[l, r]区间的任何数 floor((m-1)/i) 都相等
        r = (v == 0) ? n : min(n, x / v);  //数论分块理论
        ans = min(ans, n - m + l * (x / l));
    }
    cout << ans << endl;
}

signed main(){
    IOS;
    int _ = 1;
    cin >> _;
    while(_--){
        solve();
    }
}
```

## 7. **常见错误与陷阱**

- **易错点分析**：数学公式计算容易出错，要对**数论分块（整除分块）**有一定理解
    
- **调试技巧**：公式的验证


## 8. **拓展与变种**

- **相关问题**：暂无
    
- **实际应用**：计算数学整除的一些问题

## 9. **总结与收获**

### 总结：
- 一个数论题，需要有一定的数学知识，将现有公式转化成我们所想要的表达式，根据表达式的特性，取决我们的操作
### 核心知识点
- **数论分块（整除分块)**
### 思维模式
- 先读题，按照题目意思列出式子
- 将式子整合在一起，约化成简单的式子
- 看能否通过现有式子，转换成枚举求 最大 / 最小 的问题
- 用公式转换问题

### 学习建议
- 数学的问题一般要有很多前置知识，若是不会，则很难能在比赛中写出来，需要多多训练，巩固这些知识
