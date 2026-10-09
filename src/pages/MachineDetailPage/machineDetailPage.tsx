import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { deleteMachineImage, getMachine, MachineResponse, uploadMachineImage } from '../../services/machineService';
import './machineDetailPage.css';
import Trax_Ghana from '../../images/Trax_Ghana.png';
import { machinePicture } from '../../models/machineImages';
import PicturePicker from '../../components/PicturePicker/PicturePicker';
import { useAuth } from '../../services/AuthContext';
import { Typography } from '@mui/material';
import ProjectImageBox from '../../components/ProjectImageBox/ProjectImageBox';
import Meta from '../../components/Meta';
import Layout from '../../components/Navbar/Layout';
import CircularProgress from '@mui/material/CircularProgress';
import { useI18n } from '../../i18n/I18nContext';

const MachineDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState<MachineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'invalidId' | 'loadFailed' | null>(null);
  const imageIcon = Trax_Ghana;
  const { t } = useI18n();
  const { user } = useAuth();
  const [savingPicture, setSavingPicture] = useState(false);
  const [pictureError, setPictureError] = useState('');
  // Set by the upload form when the new machine's picture could not be uploaded.
  const uploadWarning = (useLocation().state as { uploadWarning?: string } | null)?.uploadWarning;

  // Admin only: the picture is saved right away.
  const savePicture = async (change: () => Promise<string | null>) => {
    if (!machine) return;
    setPictureError('');
    setSavingPicture(true);
    try {
      const imageUrl = await change();
      setMachine({ ...machine, imageUrl });
    } catch (err: any) {
      setPictureError(err.message || t.machineDetail.pictureFailed);
    } finally {
      setSavingPicture(false);
    }
  };

  async function getMachineData(machineId: string) {
    setLoading(true);
    setError(null);
    try {
      const machineIdNumber = parseInt(machineId, 10);
      if (isNaN(machineIdNumber)) {
        setError('invalidId');
        return;
      }
      const fetchedMachine = await getMachine(machineIdNumber);
      setMachine(fetchedMachine);
    } catch (err) {
      setError('loadFailed');
      console.error('Error fetching machine:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getMachineData(id);
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>{t.machineDetail[error]}</h2>
        </div>
      </Layout>
    );
  }

  if (!machine) {
    return (
      <Layout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>{t.machineDetail.notFound}</h2>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Meta title={machine.name}></Meta>
      <Layout>
        <div className="machineDetailoutline">
          <div className="Title">{machine.name}</div>
          {uploadWarning && (
            <Typography color="error" textAlign="center" sx={{ mb: 2 }}>
              {uploadWarning}
            </Typography>
          )}
          <ProjectImageBox source={machinePicture(machine) ?? imageIcon} altText={t.machineDetail.imageAlt} />
          {user?.isAdmin && (
            <PicturePicker
              image={machine.imageUrl ? machinePicture(machine) : undefined}
              showThumbnail={false}
              busy={savingPicture}
              error={pictureError}
              onPicked={(picked) => savePicture(() => uploadMachineImage(machine.id, picked))}
              onRemove={() =>
                savePicture(async () => {
                  await deleteMachineImage(machine.id);
                  return null;
                })
              }
            />
          )}
          <hr />
          <div className="machineInformation">
            <div className="infoRow">
              <b>{t.machineDetail.whatItDoes}</b> {machine?.whatItDoes}
            </div>
            <div className="infoRow">
              <b>{t.machineDetail.howItWorks}</b> {machine?.howItWorksAndAcquired}
            </div>
            <div className="infoRow">
              <b>{t.machineDetail.lessons}</b> {machine?.operationComplicationsAndLessons}
            </div>
            {machine.plastics && machine.plastics.length > 0 && (
              <div className="infoRow">
                <b>{t.machineDetail.plasticTypes}</b>{' '}
                {machine.plastics.map((p, index) => (
                  <span key={p.id}>
                    {index > 0 && ' '}
                    <span className="plasticTag">{p.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <hr />
        </div>
      </Layout>
    </>
  );
};

export default MachineDetailsPage;
