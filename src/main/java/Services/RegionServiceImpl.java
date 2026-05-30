package Services;

import Entities.Region;
import Repositories.BaseRepository;
import Repositories.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RegionServiceImpl extends BaseServiceImpl<Region, Long> implements RegionService {

    @Autowired
    private RegionRepository regionRepository;

    public RegionServiceImpl(BaseRepository<Region, Long> baseRepository) {
        super(baseRepository);
    }
}
