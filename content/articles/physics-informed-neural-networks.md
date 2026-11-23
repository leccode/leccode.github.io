---
title: Physics-Informed Neural Networks
description: How PINNs embed physical laws into training when data is scarce.
date: 2026-10-31
tags: [Deep learning, Science]
hue: 200
featured: true
---

We live in an era where data plays a crucial role in our daily lives. Data has always helped us draw conclusions and make critical decisions. In recent decades we have used technology and AI (a field shaped in the 1950s by Alan Turing’s work, with the term itself coined by John McCarthy in 1955) to develop algorithms that solve problems across science and industry. For example, medical images can help predict a patient’s disease or likely response to treatment, depending, of course, on the data.

A category of AI that goes a step beyond machine learning (ML) is deep learning (DL). At its core are artificial neural networks (ANNs), built from neurons. Each neuron computes a weighted sum of its inputs plus a bias:

$$ z = Σ (wᵢ · xᵢ) + b, for i = 1 … n [^1] $$

In vector form, followed by an activation function σ:

$$ z = w · x + b → a = σ(z) = σ(w · x + b) [^1] $$

## When data is scarce

Problems arise when data is hard to obtain, scarce or of poor quality. ANNs can sometimes still find patterns without much reliable data, and making that dependable is an active research challenge.

One answer is to use physical laws to help identify the real system. In computational science, engineers simulate phenomena with mathematical models; neural networks can adopt the same paradigm through differential equations.

## Physics-informed neural networks

From this idea comes a new category of ANNs: **physics-informed neural networks (PINNs)**, formally introduced by M. Raissi, P. Perdikaris and G. E. Karniadakis.[^2]

PINNs solve problems governed by partial differential equations (PDEs). The physical laws are embedded directly into training: the loss function, which measures the quality of the result, is designed to minimise the residuals of the equations.[^2][^3][^4]

$$ L = L~PDE~ + L~IC~ + L~BC~ [^4] $$

- **L~PDE~** is the loss from the PDE residuals.
- **L~IC~** is the loss from the initial conditions.
- **L~BC~** is the loss from the boundary conditions.

![PINN architecture: inputs x and t feed a fully connected network whose output u(x, t) is trained on a combined data loss and physics loss.](/images/articles/pinns-infographic.webp "Architecture of a PINN. The network minimises data loss and physics loss together. AI-generated illustration for educational purposes.")

## How it works

A PINN minimises a loss made of two parts:

- **Data loss:** the error between the network’s predictions and any observed data.[^5]
- **Physics loss:** the residual of the governing PDE at collocation points, which must be close to zero.[^5]

Combining the two forces the network to obey the laws of physics, which makes PINNs powerful for both forward and inverse problems in scientific computing.[^5]

[^1]: Cornell Virtual Workshop, “Multi-Layer Perceptron,” _Scientific Machine Learning (SciML)_, Cornell University. [Link](https://cvw.cac.cornell.edu/SciML/mlp/perceptron)

[^2]: M. Raissi, P. Perdikaris, G. E. Karniadakis, “Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations,” _Journal of Computational Physics_, vol. 378, pp. 686–707, 2019. [PDF](https://faculty.sites.iastate.edu/hliu/files/inline-files/PINN_RPK_2019_1.pdf)

[^3]: Y. Shin, Z. Zhang, G. E. Karniadakis, “Theoretical foundations of physics-informed neural networks and deep neural operators: A brief review,” in _Handbook of Numerical Analysis_, vol. 25, Elsevier, 2024, pp. 293–358. [DOI](https://doi.org/10.1016/bs.hna.2024.05.008)

[^4]: GeeksforGeeks, “Partial Differential Equations (PDEs) in Deep Learning,” _GeeksforGeeks_, May 2024. [Link](https://www.geeksforgeeks.org/deep-learning/partial-differential-equations-pdes-in-deep-larning/#1-physicsinformed-neural-networks-pinns)

[^5]: Cornell Virtual Workshop, “Physics-Informed Training,” _DeepONet: Operator Learning with Neural Networks_, Cornell University. [Link](https://cvw.cac.cornell.edu/SciML/deeponet/pi-deeponet-training)
