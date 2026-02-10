---
title: Codeforces Round 1075 (Div. 2)
published: 2026-01-24
pinned: false
description: codeforceDiv2 A,B,C1,C2,D1
tags:
  - codeforce
category: 题解
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-01-24
pubDate: 2026-01-24
---
## [A - Table with Numbers](https://codeforces.com/contest/2189/problem/A)

### 题目大意：
- 可以理解为 给你 n 个值作为x 或者 y，并放入为 `h * l` 的棋盘中，问你如何分配x 和 y 使得 放入棋盘中的数量最多。
- 输入:

```
7
2 1 1
1 1
5 2 2
1 2 2 3 2
8 4 2
7 2 2 2 3 4 4 2
7 3 6
10 4 1 3 5 4 6
2 4 4
5 5
7 6 3
10 4 1 3 5 4 6
4 1 1
1 1 1 1
```
- 输出:
```
1
2
3
2
0
2
2
```

### 理解和思路：
- 从题意不难看出，本质上就是找一个最优的方式去落子。不妨设 棋盘的大小为 `n * m` 且 `n < m` 。
- 想要落子， 必须确保`x < n && y < m`如果存在 `m < y` 的情况一定不成立，所以直接删了即可, 剩余的子至少一定能落在 m轴上(但还不一定能分配在 n轴上)
- 再去判断 能放在 n 轴的数量 `即 x < n 的数量`
-  答案就是 `min(c1 / 2, c2);` 其中 `c1表示能落在m轴的数量,c2表示能落在n轴数量`

### 代码:
```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1e2 + 10;

int n,m ,k;
int a[N], st[N];

/**
 * @brief 解决当前测试数据的核心函数
 * 
 * @details 算法逻辑：
 * 1. 读取三个参数：k(数组长度), n(较小阈值), m(较大阈值)
 * 2. 确保 n <= m，通过交换实现
 * 3. 读取数组元素，过滤掉大于m的元素
 * 4. 排序数组并统计小于等于n的元素个数
 * 5. 最终结果取：满足条件的元素个数 和 数组长度一半 的最小值
 * 
 * @note 这道题的关键是找到最优分配策略，使得两组都能满足条件
 */
void solve(){
    // 读取输入参数：k-数组长度，n-第一组阈值，m-第二组阈值
    cin >> k >> n >> m;
    
    // 确保n是较小的阈值，通过交换实现
    // 这样后续逻辑只需要判断a[i] <= n即可
    if(n > m) swap(n, m);
    
    // 读取数组元素，同时进行数据清洗
    // 过滤掉大于m的元素（这些元素两组都无法容纳）
    for(int i = 1; i <= k; i++) {
        cin >> a[i];
        // 如果当前元素大于m，则回退索引并减少总长度
        // 相当于删除这个无效元素
        if(a[i] > m) i--, k--;
    }
    
    // 对有效元素进行排序，便于后续统计
    sort(a + 1, a + k + 1);
    
    // 统计满足第一组条件（a[i] <= n）的元素个数
    int cnt = 0;
    for(int i = 1; i <= k; i++){
        if(a[i] <= n) cnt++;
    }
    
    // 最终结果取最小值：
    // - cnt：满足第一组条件的元素个数
    // - k/2：理论上的最优分配（两组平分）
    // 这样可以确保两组都能获得足够的元素
    cout << min(cnt, k / 2) << endl;
}

int main(){
    int _ = 1;
    cin >> _;
    while(_--){
        solve();
    }
}
```


## [B - The Curse of the Frog](https://codeforces.com/contest/2189/problem/B)
### 题目大意:
- 这是一个青蛙跳格子的游戏,就说说关键点:
- 1.青蛙有 n 种跳法, 其中 
	- `a[i] 表示第i种跳法的格数`
	- `b[i] - 1 表示第a[i]种跳法 最多能免费跳的次数`
	- `c[i] 表示每跳b[i] - 1次就会往回跳 c[i]格(先回跳再往前)`
- 2.问青蛙到达 x  点最少需要多少次回跳

- 输入:
```
6
1 1
3 3 3
1 7
4 2 5
2 4
1 2 3
2 2 4
5 8
12 1 11
10 1 4
1 1 3
1 2 5
2 1 7
1 1000000000000000000
1000000 4 654321
1 10
2 2 1

```
- 输出:
```
0
1
-1
2
298892990032
3
```

### 理解和思路：
- 这也是一题明显的贪心问题，我们要找到一个最优的跳格子方法，使得到大 x 格，往回跳的次数少。
- 很明显每一种魔法，都有`b[i] - 1` 次免费的跳格子机会，可以先减去。即$$x=x-\sum_{i=1}^{n} (a_i \cdot (b_i-1))$$
- 1. 如果 $x<0$则说明一定可以在0步回退前到达x格子
- 2. x > 0：则持续的进行一个跳格魔法，直到到达x格
	- 能成立的前提是：至少有一个 $0 < a_i \cdot b_i - c_i$ 否则无法到达 x 格
	- 若有，则挑选 $max(a_i \cdot b_i - c_i)$表示会跳一次往前最多的值
	- 计算回跳次数 **$\lceil \frac{x}{max(a_i \cdot b_i - c_i)} \rceil$** 就是答案
### 代码:
```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
const int N = 1e5 + 10, INF = 1e18;
using PII = pair<int, pair<int,int>>;

int n, m, x;
int a[N], b[N], c[N];

/**
 * @brief 解决魔法使用策略的核心函数
 * 
 * @details 算法思路：
 * 1. 数据预处理：过滤掉无需使用魔法的物品（b[i]=1且a[i]<=c[i]）
 * 2. 贪心策略：优先使用"性价比"最高的魔法
 * 3. 资源分配：先用免费机会，再用付费机会
 * 
 * @note 关键在于如何高效利用有限的魔法资源x
 */
void solve()
{
    // 读取输入：n-物品数量，x-可用魔法资源
    cin >> n >> x;
    
    // 第一步：数据预处理，过滤无效物品
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i] >> b[i] >> c[i];
        // 对于b[i]=1的物品，如果a[i]<=c[i]，则无需使用魔法
        // 直接过滤掉这些物品，减少后续处理复杂度
        if (b[i] == 1)
        {
            if (a[i] <= c[i])
                n--, i--;
        }
    }
    
    // 第二步：构建需要付费魔法的物品列表
    vector<PII> q;
    for (int i = 1; i <= n; i++)
    {
        // 跳过那些即使使用魔法也无法满足的物品
        if (a[i] * b[i] <= c[i])
            continue;
        
        // 存储魔法信息：
        // first: 魔法消耗 = a[i]*b[i] - c[i]（付费部分）
        // second.first: 总价值 = b[i]*a[i]
        // second.second: 魔法类型 = b[i]
        q.push_back({a[i] * b[i] - c[i], {b[i] * a[i], b[i]}});
    }
    
    // 第三步：使用免费魔法机会（b[i]-1次免费使用）
    for (int i = 1; i <= n; i++)
    {
        // b[i]=1的物品已经处理过了，跳过
        if(b[i] == 1 ) continue;
        
        // 如果有足够的资源使用免费魔法
        if (a[i] * (b[i] - 1) <= x)
        {
            x -= a[i] * (b[i] - 1);
        }
        else
        {
            // 资源不足，清空剩余资源并退出
            x = 0;
            break;
        }
    }

    // 第四步：处理剩余资源和结果计算
    if (x == 0)
    {
        cout << 0 << endl;
        return;
    }
    
    // 如果没有需要付费魔法的物品，返回-1
    if(q.empty()){
        cout << -1 << endl;
        return;
    }
    
    // 第五步：贪心选择最优魔法
    int cnt = 0;
    // 按魔法消耗降序排序，优先使用消耗大的魔法
    sort(q.begin(), q.end(), [](PII a, PII b){
        if(a.first != b.first) return a.first > b.first;
        return a.second.first > b.second.first; });
    
    // 计算可以使用的魔法次数
    if(q[0].second.second == 1){
        // 向上取整计算：(x + cost - 1) / cost
        cnt = (x + q[0].first - 1) / q[0].first;
        cout << cnt << endl;
        return;
    }
    
    // 通用情况：计算剩余资源可以支持的魔法次数
    cnt = (x  + q[0].first - 1) / q[0].first;
    cout << cnt << endl;
}

signed main()
{
    int _ = 1;
    cin >> _;
    while (_--)
    {
        solve();
    }
}
```

## [C1 - XOR Convenience (Easy Version)](https://codeforces.com/contest/2189/problem/C1)
- 题目概述：让你构造出一个排列，满足$a_i \neq a_j,a_i \in [1,n]$，使得存在 $a_j(i<j)=a_i \bigoplus i$ 且 $i \in [2,n-1]$ 
- 简单举个例子:
- 输入：
```
2
3
6
```
- 输出：
```
2 1 3
3 6 2 5 1 4
```
- $1 \bigoplus 2 = 3$ （不包含 1 和 3）所以 排序 `2 1 3` 成立

### 理解和思路：
- 本题比较考对异或的认识：
	- 1. 首先你必须知道 异或是什么 `简单说就是同位 相同0 不同1`
	- 2. `a ^ b == c` a 只有 异或 b == c 不存在其他数字，具有唯一性
	- 3. `a ^ b == c -> a ^ b ^ b == b ^ c -> a == b ^ c`
- 再探究怎么写：
	- 首先 $n-1$点一定要满足$a_n-1 \bigoplus (n-1) == a_n$
	- 不妨让**所有 $a_i \bigoplus i == a_n$ 即是: $a_n \bigoplus i == a_i$** 
	- 因为 $a_i \leq n$，即$a_n \bigoplus i \leq n$ 当 $a_n = 1$时 $a_n-1 \bigoplus 1 <= n$ 成立
	- **又因为 `a ^ b == c` 具有唯一性,不会重复**，因此我们将得到一个不重复的排序
	- 最后一个剩余的数字放个$a_1$

### 代码:
```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
const int N = 2e5 + 10, INF = 1e18;
using PII = pair<int, pair<int,int>>;

int n;
int a[N], st[N];

/**
 * @brief 构造满足特定条件的排列
 * @details 
 * 构造一个长度为n的排列a，使得对于每个位置i，a[i] ^ i的值尽可能分散。
 * 算法思路：
 * 1. 初始化标记数组st，记录哪些数字已被使用
 * 2. 特殊处理位置n：设置a[n] = 1
 * 3. 对于位置2到n-1：设置a[i] = i ^ 1，这样a[i] ^ i = 1
 * 4. 找到未使用的数字，填入位置1
 * 5. 输出构造的排列
 * 
 * 关键性质：对于i ∈ [2, n-1]，有a[i] ^ i = 1
 * 这样可以让异或结果集中在小数值，便于后续处理
 */
void solve()
{
    cin >> n;  // 读取排列长度
    
    // 初始化标记数组，st[i] = 1表示数字i已被使用
    for(int i = 1; i <= n; i++) st[i] = 0;
    
    // 特殊处理：设置a[n] = 1，并标记数字1已被使用
    a[n] = 1, st[1] = 1;
    
    // 构造核心部分：对于位置2到n-1
    // 设置a[i] = i ^ 1，这样a[i] ^ i = 1（异或性质）
    for(int i = 2; i < n; i++){
        a[i] = i ^ 1;  // 异或操作，a[i] ^ i将得到1
        st[a[i]] = 1;  // 标记该数字已被使用
    }

    // 找到未使用的数字，填入位置1
    // 这个位置的特殊性在于a[1] ^ 1需要与其他位置不同
    for(int i = 1; i <= n; i++){
        if(!st[i]) {  // 找到第一个未使用的数字
            a[1] = i;
            break;
        }
    }
    
    // 输出构造的排列
    for(int i = 1; i <= n; i++){
        cout << a[i] << " ";
    }
    cout << endl;
}

signed main()
{
    int _ = 1;
    cin >> _;
    while (_--)
    {
        solve();
    }
}
```
## [C2 - XOR-convenience (Hard Version)](https://codeforces.com/contest/2189/problem/C2)

### 题目大意：
- 和上题大差不差，区别为:
	- 从$i \in [1,n-1]$都得满足 $a_i \bigoplus i==a_j$
	- 存在输出排序， 不存在输出 -1
- 输入：
```
2
3
4
```
- 输出:
```
2 1 3
-1
```

### 理解和思路：
- 基本要点就不重述了
- 根据我们最开始得到的理论，必须保证:
	-  $a_i \leq n$，即$a_n \bigoplus i \leq n$ 当 $a_n = 1$时 $a_n-1 \bigoplus 1 <= n$ 成立
- 1. 当$n=2^k$时 n 的二进制表达为$10000...$ 任意数字 异或 n 都是 大于n的一定不成立
- 还有个前置： 任意数字异或1 可以分为两类:
	- 1. 奇数 $a \bigoplus 1 == a - 1$
	- 2. 偶数 $a \bigoplus 1 == a + 1$ 
	- 因此我们可以很明显的发现 每一对 `{偶数，奇数}`可以配对，且相差1
	- 因此我们可以设定将 $a_n = 1$
- 2. 当$n=2^k + r$时
	- 1. n为奇数：
		- 除了$a_n$以外的所有数都可以配凑成${i+1,i}$ 并且满足 $i \bigoplus 1 == a[i]$
		- $i=1$时: $a_1=n-1$ 且 $(n-1) \bigoplus n == 1$ 成立`（因为一定找得到一个aj=n且i < j)
		- $i=n-1$时:同理于奇偶数配对成立
		- 所以一定有一个排列成立
	- 2. n为偶数
		- 我们还能够凑出奇偶数配对 `{偶数，奇数}`不同的是，**n 数字被留空了，没人接手 数字n**
		- 比如:`1 2 3 4 5 6` 接手后应该是 `6 3 2 5 4 1` 但是很明显 `6 ^ 1 = 7`不成立
		- 所以得找到能够替换的值
		- 观察式子$n=2^k + r$ 可以发现 $n \bigoplus r == 2^k$  且 r 一定是偶数
		- 借此我们可以将 $a_r=n,a_1=r+1$ 就是交换 $a_r a_1$
		- $r+1 \bigoplus 1==r==a_r+1$ 成立
		- $n \bigoplus r==2^k$ 且 $r<2^k$ 故成立
### 代码：
```cpp
#include <bits/stdc++.h>
using namespace std;

#define IOS ios::sync_with_stdio(0), cin.tie(0), cout.tie(0)

int n;

void solve() {
    cin >> n;
    if(n == (1 << __lg(n))){ //判断是否为2的幂次 __lg(n) 表示 n 的二进制表示中 1 的最高位从0开始
        cout << -1 << endl;
        return;
    }
    
    if(n % 2 == 0){ //如果是偶数
        vector<int> ans = {n};
        for(int i = 2; i <= n - 2; i+=2){
            ans.push_back(i + 1);
            ans.push_back(i);
        } // 每一个 a[i] ^ i 都 = 1 即此时 j = n
        ans.push_back(1);
        // n = 2 ^ k + r , r是除了最高位以外的数字
        int r = n - (1 << __lg(n));
        // 因为 r是偶数 所以此时ans[0] = r + 1, a[r] = n
        // r + 1 ^ 1 = r 能够在 ans[r + 1] 找到
        // n ^ r = 2 ^ k > r 能够在 ans[2 ^ k + 1] 找到
        // 故所有点 i 都能找到 点j使得 a[i] = a[j] ^ i
        swap(ans[0] ,ans[r - 1]);
        for(int i = 0; i < n; i++){
            cout << ans[i] << " ";
        }
        cout << endl;

    }else{
        cout << n - 1 << " ";
        for(int i = 2; i <= n - 3; i+=2){
            cout << i + 1 << " " << i << " ";
        }
        cout << n << " " << 1 << endl;
    }
}

int main() {
    IOS;
    int t;
    cin >> t;
    while (t--) {
        solve();
    }
    return 0;
}
```