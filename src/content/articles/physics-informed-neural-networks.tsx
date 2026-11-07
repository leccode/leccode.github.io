import Image from "next/image";
import {
  Cite,
  Equation,
  Note,
  Prose,
  figureClassName,
} from "@/components/article/Prose";
import type { Source } from "@/components/article/ArticleLayout";
import infographic from "./images/pinns-infographic.webp";

export const sources: readonly Source[] = [
  {
    text: (
      <>
        Cornell Virtual Workshop, “Multi-Layer Perceptron,”{" "}
        <em>Scientific Machine Learning (SciML)</em>, Cornell University.
      </>
    ),
    href: "https://cvw.cac.cornell.edu/SciML/mlp/perceptron",
    label: "Link",
  },
  {
    text: (
      <>
        M. Raissi, P. Perdikaris, G. E. Karniadakis, “Physics-informed neural
        networks: A deep learning framework for solving forward and inverse
        problems involving nonlinear partial differential equations,”{" "}
        <em>Journal of Computational Physics</em>, vol. 378, pp. 686–707, 2019.
      </>
    ),
    href: "https://faculty.sites.iastate.edu/hliu/files/inline-files/PINN_RPK_2019_1.pdf",
    label: "PDF",
  },
  {
    text: (
      <>
        Y. Shin, Z. Zhang, G. E. Karniadakis, “Theoretical foundations of
        physics-informed neural networks and deep neural operators: A brief
        review,” in <em>Handbook of Numerical Analysis</em>, vol. 25, Elsevier,
        2024, pp. 293–358.
      </>
    ),
    href: "https://doi.org/10.1016/bs.hna.2024.05.008",
    label: "DOI",
  },
  {
    text: (
      <>
        GeeksforGeeks, “Partial Differential Equations (PDEs) in Deep Learning,”{" "}
        <em>GeeksforGeeks</em>, May 2024.
      </>
    ),
    href: "https://www.geeksforgeeks.org/deep-learning/partial-differential-equations-pdes-in-deep-larning/#1-physicsinformed-neural-networks-pinns",
    label: "Link",
  },
  {
    text: (
      <>
        Cornell Virtual Workshop, “Physics-Informed Training,”{" "}
        <em>DeepONet: Operator Learning with Neural Networks</em>, Cornell
        University.
      </>
    ),
    href: "https://cvw.cac.cornell.edu/SciML/deeponet/pi-deeponet-training",
    label: "Link",
  },
];

export function Body() {
  return (
    <Prose>
      <p>
        We live in an era where data plays a crucial role in our daily lives.
        Data has always helped us draw conclusions and make critical decisions.
        In recent decades we have used technology and AI (a field shaped in the
        1950s by Alan Turing’s work, with the term itself coined by John
        McCarthy in 1955) to develop algorithms that solve problems across
        science and industry. For example, medical images can help predict a
        patient’s disease or likely response to treatment, depending, of course,
        on the data.
      </p>

      <p>
        A category of AI that goes a step beyond machine learning (ML) is deep
        learning (DL). At its core are artificial neural networks (ANNs), built
        from neurons. Each neuron computes a weighted sum of its inputs plus a
        bias:
      </p>

      <Equation>
        z = Σ (wᵢ · xᵢ) + b, &nbsp;for i = 1 … n <Cite n={1} />
      </Equation>

      <p>In vector form, followed by an activation function σ:</p>

      <Equation>
        z = w · x + b &nbsp;→&nbsp; a = σ(z) = σ(w · x + b) <Cite n={1} />
      </Equation>

      <h2>When data is scarce</h2>
      <p>
        Problems arise when data is hard to obtain, scarce or of poor quality.
        ANNs can sometimes still find patterns without much reliable data, and
        making that dependable is an active research challenge.
      </p>
      <p>
        One answer is to use physical laws to help identify the real system. In
        computational science, engineers simulate phenomena with mathematical
        models; neural networks can adopt the same paradigm through differential
        equations.
      </p>

      <h2>Physics-informed neural networks</h2>
      <p>
        From this idea comes a new category of ANNs:{" "}
        <strong>physics-informed neural networks (PINNs)</strong>, formally
        introduced by M. Raissi, P. Perdikaris and G. E. Karniadakis.
        <Cite n={2} />
      </p>
      <p>
        PINNs solve problems governed by partial differential equations (PDEs).
        The physical laws are embedded directly into training: the loss
        function, which measures the quality of the result, is designed to
        minimise the residuals of the equations.
        <Cite n={2} />
        <Cite n={3} />
        <Cite n={4} />
      </p>

      <Equation>
        L = L<sub>PDE</sub> + L<sub>IC</sub> + L<sub>BC</sub> <Cite n={4} />
      </Equation>

      <ul>
        <li>
          <strong>
            L<sub>PDE</sub>
          </strong>{" "}
          is the loss from the PDE residuals.
        </li>
        <li>
          <strong>
            L<sub>IC</sub>
          </strong>{" "}
          is the loss from the initial conditions.
        </li>
        <li>
          <strong>
            L<sub>BC</sub>
          </strong>{" "}
          is the loss from the boundary conditions.
        </li>
      </ul>

      <figure className={figureClassName}>
        <Image
          src={infographic}
          alt="PINN architecture: inputs x and t feed a fully connected network whose output u(x, t) is trained on a combined data loss and physics loss."
          sizes="(min-width: 768px) 720px, 100vw"
          placeholder="empty"
        />
        <figcaption>
          Architecture of a PINN. The network minimises data loss and physics
          loss together. AI-generated illustration for educational purposes.
        </figcaption>
      </figure>

      <h2>How it works</h2>
      <p>A PINN minimises a loss made of two parts:</p>
      <ul>
        <li>
          <strong>Data loss:</strong> the error between the network’s
          predictions and any observed data.
          <Cite n={5} />
        </li>
        <li>
          <strong>Physics loss:</strong> the residual of the governing PDE at
          collocation points, which must be close to zero.
          <Cite n={5} />
        </li>
      </ul>
      <p>
        Combining the two forces the network to obey the laws of physics, which
        makes PINNs powerful for both forward and inverse problems in scientific
        computing.
        <Cite n={5} />
      </p>

      <Note>
        A hands-on implementation guide with code is coming in a future article.
      </Note>
    </Prose>
  );
}
