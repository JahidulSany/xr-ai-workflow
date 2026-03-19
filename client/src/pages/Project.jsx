import { useState } from 'react';

const Project = () => {
  const [projectName, setProjectName] = useState('');
  const [xrType, setXrType] = useState('');
  const [objectMethod, setObjectMethod] = useState('');
  const [environmentMethod, setEnvironmentMethod] = useState('');
  const [platform, setPlatform] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      projectName,
      xrType,
      objectMethod,
      environmentMethod,
      platform,
    };

    console.log(data);
  };

  return (
    <div>
      <div>
        <h2>XR Project Workflow</h2>
        <p>
          This form will help you create a project by selecting the XR type,
          object creation method, environment creation method, and platform.
          Fill out the form and submit to see your selections in the console.
        </p>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <label>Project Name:</label>
          <br />
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <br />
          <br />

          <h3>1. Choose XR Type</h3>

          <label>
            <input
              type="radio"
              name="xrType"
              value={xrType}
              checked={xrType === 'VR'}
              onChange={(e) => setXrType(e.target.value)}
            />
            VR
          </label>

          <label>
            <input
              type="radio"
              name="xrType"
              value="AR"
              checked={xrType === 'AR'}
              onChange={(e) => setXrType(e.target.value)}
            />
            AR
          </label>

          <label>
            <input
              type="radio"
              name="xrType"
              value="MR"
              checked={xrType === 'MR'}
              onChange={(e) => setXrType(e.target.value)}
            />
            MR
          </label>

          <br />
          <br />

          <h3>2. Object Creation</h3>

          <label>
            <input
              type="radio"
              name="objectMethod"
              value="3D Scan"
              checked={objectMethod === '3D Scan'}
              onChange={(e) => setObjectMethod(e.target.value)}
            />
            3D Scan
          </label>

          <label>
            <input
              type="radio"
              name="objectMethod"
              value="3D Model"
              checked={objectMethod === '3D Model'}
              onChange={(e) => setObjectMethod(e.target.value)}
            />
            3D Model
          </label>

          <label>
            <input
              type="radio"
              name="objectMethod"
              value="Asset Library"
              checked={objectMethod === 'Asset Library'}
              onChange={(e) => setObjectMethod(e.target.value)}
            />
            Asset Library
          </label>

          <br />
          <br />

          <h3>3. Environment Creation</h3>

          <label>
            <input
              type="radio"
              name="environmentMethod"
              value="3D Scan"
              checked={environmentMethod === '3D Scan'}
              onChange={(e) => setEnvironmentMethod(e.target.value)}
            />
            3D Scan Environment
          </label>

          <label>
            <input
              type="radio"
              name="environmentMethod"
              value="3D Model"
              checked={environmentMethod === '3D Model'}
              onChange={(e) => setEnvironmentMethod(e.target.value)}
            />
            3D Model Environment
          </label>

          <label>
            <input
              type="radio"
              name="environmentMethod"
              value="Asset Library"
              checked={environmentMethod === 'Asset Library'}
              onChange={(e) => setEnvironmentMethod(e.target.value)}
            />
            Asset Library Environment
          </label>

          <br />
          <br />

          <h3>4. Platform</h3>

          <label>
            <input
              type="radio"
              name="platform"
              value="Mobile"
              checked={platform === 'Mobile'}
              onChange={(e) => setPlatform(e.target.value)}
            />
            Mobile
          </label>

          <label>
            <input
              type="radio"
              name="platform"
              value="Web"
              checked={platform === 'Web'}
              onChange={(e) => setPlatform(e.target.value)}
            />
            Web Browser
          </label>

          <label>
            <input
              type="radio"
              name="platform"
              value="Headset"
              checked={platform === 'Headset'}
              onChange={(e) => setPlatform(e.target.value)}
            />
            Headset
          </label>

          <label>
            <input
              type="radio"
              name="platform"
              value="Console"
              checked={platform === 'Console'}
              onChange={(e) => setPlatform(e.target.value)}
            />
            Games Console
          </label>

          <br />
          <br />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Project;
