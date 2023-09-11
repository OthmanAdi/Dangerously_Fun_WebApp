import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from "styled-components";
import Swal from 'sweetalert2';

const Section = styled.div`
  min-height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
`;

const ScrollContainer = styled.div`
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
`;

const TableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 20px;
`;

const ListContainer = styled.div`
  height: 20vh;  /* Set the height to fit 5 items */
  overflow-y: scroll;
`;

const InputGroupContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SectionsContainer = styled.div`
  max-height: 40vh;  /* Set the maximum height */
  overflow-y: auto;  /* Enable vertical scrolling */
  display: flex;
  flex-direction: column;
  gap: 10px;  /* Set the gap between sections */
`;


export default function App() {
  const [songUrl, setSongUrl] = useState('');
  const [urlList, setUrlList] = useState([]);

  const [audioFormat, setAudioFormat] = useState('mp3');

  const [sections, setSections] = useState([{ songUrl: '', audioFormat: 'mp3', urlList: [] }]);



  const handleAddUrl = async (index) => {
    const newSections = [...sections];
    const section = newSections[index];

    try {
      // Call the API to download the song
      const response = await fetch('http://localhost:3001/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: section.songUrl, format: section.audioFormat }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Download successful:', data);

        // Add the new URL at the top of the list
        section.urlList = [section.songUrl, ...section.urlList];
        newSections[index] = section;
        setSections(newSections);

        Swal.fire({
          icon: 'success',
          title: 'OK',
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        console.log('Download failed:', response.status);

        Swal.fire({
          icon: 'error',
          title: 'Song not found',
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);

      Swal.fire({
        icon: 'error',
        title: 'Song not found',
        showConfirmButton: false,
        timer: 1000,
      });
    }

    // Clear the input field
    section.songUrl = '';
    newSections[index] = section;
    setSections(newSections);
  };

  const addSection = () => {
    setSections([...sections, { songUrl: '', audioFormat: 'mp3', urlList: [] }]);
  };


  return (
    <ScrollContainer>
      <Section className="container-fluid text-center">
        <h1 className="display-3">Download Spotify Songs with <code>spotdl</code></h1>
        <h1 className="display-5 text-center my-4">How to Download Music with SpotDL</h1>
        <p className="text-center mb-4">
          SpotDL is a utility that allows you to download music from Spotify directly to your computer.
          Here's a simple guide on how to use it with terminal commands.
        </p>
      </Section>

      <Section className="container-fluid text-center">
        <TableContainer>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="text-center">Command</th>
                <th className="text-center">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center"><code>spotdl [trackUrl]</code></td>
                <td className="text-center">Download a track by its Spotify URL</td>
              </tr>
              <tr>
                <td className="text-center"><code>spotdl --song [song name]</code></td>
                <td className="text-center">Download a track by its name</td>
              </tr>
              <tr>
                <td className="text-center"><code>spotdl -f wav</code></td>
                <td className="text-center">Download in WAV format</td>
              </tr>
              <tr>
                <td className="text-center"><code>spotdl -f flac</code></td>
                <td className="text-center">Download in FLAC format</td>
              </tr>
            </tbody>
          </table>
        </TableContainer>

        <h1 className="display-6 text-center my-4">Examples</h1>

        <p className="text-center">
          To download a song in WAV format, you can use the following command:
          <code className="d-block text-center my-2">spotdl [trackUrl] -f wav</code>
        </p>

        <p className="text-center">
          To download a song in FLAC format, you can use the following command:
          <code className="d-block text-center my-2">spotdl [trackUrl] -f flac</code>
        </p>
      </Section>

      <Section className="container-fluid text-center">

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <button className="btn btn-success w-25" style={{ width: 'auto' }} onClick={addSection}>New Section</button>
        </div>

        <SectionsContainer>
          {sections.map((section, index) => (
            <div key={index}>
              <InputGroupContainer>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Song URL"
                  value={section.songUrl}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[index].songUrl = e.target.value;
                    setSections(newSections);
                  }}
                />
                <select
                  className="form-control"
                  value={section.audioFormat}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[index].audioFormat = e.target.value;
                    setSections(newSections);
                  }}
                >
                  <option value="mp3">MP3</option>
                  <option value="wav">WAV</option>
                  <option value="flac">FLAC</option>
                </select>
                <button className="btn btn-primary" onClick={() => handleAddUrl(index)}>Download</button>
              </InputGroupContainer>
              <ListContainer>
                <ul className="list-group">
                  {section.urlList.map((url, i) => (
                    <li key={i} className="list-group-item text-center text-truncate alert alert-primary">
                      {url}
                    </li>
                  ))}
                </ul>
              </ListContainer>
            </div>
          ))}
        </SectionsContainer>
      </Section>
    </ScrollContainer >
  );
}
